import { useCallback, useLayoutEffect, useRef, type RefObject } from "react";

import { gsap, killMotion } from "./gsapMotion";
import { isMotionFeatureEnabledFor, motionExpandFor, resolveMotionConfig, type MotionConfig } from "./motionConfig";
import { useMotionConfig } from "./motionConfigContext";
import { prefersReducedMotion, usePrefersReducedMotion } from "./reducedMotion";

/** Content wrapper height (padding + child borders; no margin collapse). Snapshot before the tween — do not pass as a GSAP function value. */
export function measureCollapsibleContentHeight(inner: HTMLElement): number {
  return inner.scrollHeight;
}

export function releaseExpandedShellHeight(shell: HTMLElement, inner: HTMLElement) {
  const measured = measureCollapsibleContentHeight(inner);
  const current = shell.getBoundingClientRect().height;

  if (measured <= 0) {
    gsap.set(shell, { clearProps: "height" });
    shell.style.removeProperty("overflow");
    return;
  }

  // Matches GSAP — straight to auto without extra snap.
  if (Math.abs(measured - current) <= 0.5) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        gsap.set(shell, { clearProps: "height" });
        shell.style.removeProperty("height");
        shell.style.removeProperty("overflow");
      });
    });
    return;
  }

  shell.style.height = `${measured}px`;
  shell.style.overflow = "hidden";

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      gsap.set(shell, { clearProps: "height" });
      shell.style.removeProperty("height");
      shell.style.removeProperty("overflow");
    });
  });
}

export function applyCollapsibleInstantState(shell: HTMLElement, open: boolean) {
  if (open) {
    gsap.set(shell, { clearProps: "height" });
    shell.style.removeProperty("height");
    shell.style.removeProperty("overflow");
  } else {
    shell.style.height = "0px";
    shell.style.overflow = "hidden";
  }
}

const COLLAPSIBLE_INIT_ATTR = "data-collapsible-init";

/**
 * Ref-callback: synchronously before paint sets height from initial `open`.
 * Not via React `style` — otherwise re-render (hasPanel, etc.) resets inline styles.
 */
export function useCollapsibleShellRef(
  shellRef: RefObject<HTMLElement | null>,
  open: boolean,
) {
  const initialOpenRef = useRef(open);

  return useCallback(
    (node: HTMLElement | null) => {
      shellRef.current = node;
      if (node && !node.hasAttribute(COLLAPSIBLE_INIT_ATTR)) {
        node.setAttribute(COLLAPSIBLE_INIT_ATTR, "");
        applyCollapsibleInstantState(node, initialOpenRef.current);
      }
    },
    [shellRef],
  );
}

export type UseCollapsibleHeightOptions = {
  /** @default () => isMotionFeatureEnabled("enableExpandable") */
  enabled?: () => boolean;
  /** Skip GSAP (Disclosure drag-handle): set height instantly. */
  skipAnimRef?: RefObject<boolean>;
};

/**
 * GSAP height animation for collapsible panel (Expandable, Accordion, Disclosure).
 */
export function useCollapsibleHeight(
  open: boolean,
  shellRef: RefObject<HTMLElement | null>,
  innerRef: RefObject<HTMLElement | null>,
  options?: UseCollapsibleHeightOptions,
) {
  const config = useMotionConfig();
  const enabledRef = useRef(options?.enabled ?? (() => isMotionFeatureEnabledFor(config, "enableExpandable")));
  enabledRef.current = options?.enabled ?? (() => isMotionFeatureEnabledFor(config, "enableExpandable"));
  const skipAnimRef = options?.skipAnimRef;
  const prevOpenRef = useRef<boolean | undefined>(undefined);
  const reduceMotionPreferred = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const shell = shellRef.current;
    const inner = innerRef.current;
    if (!shell || !inner) return;

    const reduceMotion = reduceMotionPreferred || !enabledRef.current();

    if (prevOpenRef.current === undefined) {
      prevOpenRef.current = open;
      applyCollapsibleInstantState(shell, open);
      return;
    }

    if (skipAnimRef?.current) {
      skipAnimRef.current = false;
      prevOpenRef.current = open;
      applyCollapsibleInstantState(shell, open);
      return;
    }

    if (prevOpenRef.current === open) return;
    prevOpenRef.current = open;

    animateCollapsibleHeight(shell, inner, open, { reduced: reduceMotion, config });
  }, [config, open, shellRef, innerRef, skipAnimRef, reduceMotionPreferred]);
}

export type AnimateCollapsibleHeightOptions = {
  reduced?: boolean;
  duration?: number;
  ease?: string;
  config?: Readonly<MotionConfig>;
};

const collapsibleRemeasureStops = new WeakMap<HTMLElement, () => void>();

function stopCollapsibleRemeasure(shell: HTMLElement): void {
  const stop = collapsibleRemeasureStops.get(shell);
  if (!stop) return;
  stop();
  collapsibleRemeasureStops.delete(shell);
}

/** Observe inner while enter runs; layout reads stay off the tween tick. */
function startCollapsibleEnterRemeasure(
  shell: HTMLElement,
  inner: HTMLElement,
  onHeight: (height: number) => void,
): void {
  stopCollapsibleRemeasure(shell);
  if (typeof ResizeObserver === "undefined") return;
  let last = measureCollapsibleContentHeight(inner);
  const ro = new ResizeObserver(() => {
    const next = measureCollapsibleContentHeight(inner);
    if (Math.abs(next - last) <= 0.5) return;
    last = next;
    onHeight(next);
  });
  ro.observe(inner);
  collapsibleRemeasureStops.set(shell, () => ro.disconnect());
}

/** Height tween for a collapsible shell. Used by `useCollapsibleHeight` and the `collapsibleHeight` recipe. */
export function animateCollapsibleHeight(
  shell: HTMLElement,
  inner: HTMLElement,
  open: boolean,
  options?: AnimateCollapsibleHeightOptions,
) {
  const cfg = resolveMotionConfig(options?.config);
  const reduced =
    options?.reduced ??
    (prefersReducedMotion() || !isMotionFeatureEnabledFor(cfg, "enableExpandable"));

  killMotion(shell);
  stopCollapsibleRemeasure(shell);

  if (reduced) {
    applyCollapsibleInstantState(shell, open);
    return undefined;
  }

  const expand = motionExpandFor(cfg);
  const vars = {
    duration: options?.duration ?? expand.duration,
    ease: options?.ease ?? expand.ease,
    overwrite: "auto" as const,
  };

  if (open) {
    const toHeight = measureCollapsibleContentHeight(inner);
    shell.style.overflow = "hidden";
    const finishOpen = () => {
      stopCollapsibleRemeasure(shell);
      releaseExpandedShellHeight(shell, inner);
    };
    const tween = gsap.fromTo(
      shell,
      { height: 0 },
      {
        height: toHeight,
        ...vars,
        onComplete: finishOpen,
        onInterrupt: () => stopCollapsibleRemeasure(shell),
      },
    );
    startCollapsibleEnterRemeasure(shell, inner, (next) => {
      if (!tween.isActive()) return;
      tween.resetTo("height", next);
    });
    return tween;
  }

  const current =
    shell.getBoundingClientRect().height || measureCollapsibleContentHeight(inner);
  shell.style.height = `${current}px`;
  shell.style.overflow = "hidden";
  return gsap.to(shell, {
    height: 0,
    ...vars,
    onComplete: () => {
      shell.style.height = "0px";
      shell.style.overflow = "hidden";
    },
  });
}
