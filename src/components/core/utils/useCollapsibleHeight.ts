import {
  useCallback,
  useLayoutEffect,
  useRef,
  type RefObject,
} from "react";

import { gsap, killMotion } from "./gsapMotion";
import { getMotionConfig, motionExpand } from "./motionConfig";
import { prefersReducedInteractiveHoverLift } from "./hoverInteractiveLift";

/** Высота контент-обёртки (padding + border детей; без margin collapse). */
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

  // Совпадает с GSAP — сразу auto без лишнего snap.
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
 * Ref-callback: синхронно до paint выставляет высоту по начальному `open`.
 * Не через React `style` — иначе re-render (hasPanel и т.п.) сбросит inline-стили.
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
  /** @default () => getMotionConfig().enableExpandable */
  enabled?: () => boolean;
  /** Пропустить GSAP (Disclosure drag-handle): мгновенно выставить высоту. */
  skipAnimRef?: RefObject<boolean>;
};

/**
 * GSAP-анимация высоты collapsible-панели (Expandable, Accordion, Disclosure).
 */
export function useCollapsibleHeight(
  open: boolean,
  shellRef: RefObject<HTMLElement | null>,
  innerRef: RefObject<HTMLElement | null>,
  options?: UseCollapsibleHeightOptions,
) {
  const enabledRef = useRef(options?.enabled ?? (() => getMotionConfig().enableExpandable));
  enabledRef.current = options?.enabled ?? (() => getMotionConfig().enableExpandable);
  const skipAnimRef = options?.skipAnimRef;
  const prevOpenRef = useRef<boolean | undefined>(undefined);

  useLayoutEffect(() => {
    const shell = shellRef.current;
    const inner = innerRef.current;
    if (!shell || !inner) return;

    const reduceMotion = prefersReducedInteractiveHoverLift() || !enabledRef.current();

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

    killMotion(shell);

    if (reduceMotion) {
      applyCollapsibleInstantState(shell, open);
      return;
    }

    if (open) {
      shell.style.overflow = "hidden";
      gsap.fromTo(
        shell,
        { height: 0 },
        {
          height: () => measureCollapsibleContentHeight(inner),
          ...motionExpand(),
          overwrite: "auto",
          onComplete: () => releaseExpandedShellHeight(shell, inner),
        },
      );
    } else {
      const current = shell.getBoundingClientRect().height || measureCollapsibleContentHeight(inner);
      shell.style.height = `${current}px`;
      shell.style.overflow = "hidden";
      gsap.to(shell, {
        height: 0,
        ...motionExpand(),
        overwrite: "auto",
        onComplete: () => {
          shell.style.height = "0px";
          shell.style.overflow = "hidden";
        },
      });
    }
  }, [open, shellRef, innerRef, skipAnimRef]);
}
