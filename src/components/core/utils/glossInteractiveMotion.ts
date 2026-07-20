/**
 * GSAP animations for gloss interactives: lift/squeeze like the UI kit
 * + gloss box-shadow (elevation, inner glow, press-inset) + decor (shine, conic).
 */

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type RefObject,
  type Ref,
} from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

import { gsap, killMotion } from "./gsapMotion";
import { getMotionConfig } from "./motionConfig";
import { cameFromOutsideContainer } from "./cameFromOutsideContainer";
import {
  prefersReducedInteractiveHoverLift,
  resolveAdaptiveHoverLiftScale,
  resolveAdaptivePressSqueezeScale,
  shouldSkipInteractiveHoverLift,
} from "./hoverInteractiveLift";

const GLOSS_INIT_ATTR = "data-gloss-motion-init";

/** Motion classes without `animate-shadow` — gloss shadows are animated by GSAP, not `--el-shadow`. */
export const GLOSS_INTERACTIVE_MOTION_CLASS = "will-change-transform origin-center";

export type GlossDecorState = "rest" | "hover" | "press";

const GLOSS_DECOR: Record<
  GlossDecorState,
  { angle1: number; angle2: number; shineX: number; shineY: number }
> = {
  rest: { angle1: -75, angle2: -45, shineX: 0, shineY: 50 },
  hover: { angle1: -80, angle2: -45, shineX: 10, shineY: 50 },
  press: { angle1: -75, angle2: -15, shineX: 15, shineY: 15 },
};

/** Reference size (≈ gloss button base) — only hover/press travel is scaled. */
const GLOSS_SHINE_REFERENCE_DIM = 120;
/** Minimum travel fraction on very large surfaces. */
const GLOSS_SHINE_MIN_TRAVEL = 0.35;

function resolveAdaptiveGlossShineTravel(element: HTMLElement): number {
  const { width, height } = element.getBoundingClientRect();
  const maxDim = Math.max(width, height, 1);
  return Math.min(1, Math.max(GLOSS_SHINE_MIN_TRAVEL, GLOSS_SHINE_REFERENCE_DIM / maxDim));
}

function resolveGlossDecor(element: HTMLElement, state: GlossDecorState) {
  const rest = GLOSS_DECOR.rest;
  const target = GLOSS_DECOR[state];
  if (state === "rest") return target;

  const travel = resolveAdaptiveGlossShineTravel(element);
  return {
    angle1: rest.angle1 + (target.angle1 - rest.angle1) * travel,
    angle2: rest.angle2 + (target.angle2 - rest.angle2) * travel,
    shineX: rest.shineX + (target.shineX - rest.shineX) * travel,
    shineY: rest.shineY + (target.shineY - rest.shineY) * travel,
  };
}

function readGlossVar(element: HTMLElement, name: string): string {
  const local = getComputedStyle(element).getPropertyValue(name).trim();
  if (local) return local;
  if (typeof document === "undefined") return "";
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function glossDecorVars(element: HTMLElement, state: GlossDecorState) {
  const d = resolveGlossDecor(element, state);
  return {
    "--gloss-angle-1": `${d.angle1}deg`,
    "--gloss-angle-2": `${d.angle2}deg`,
    "--gloss-shine-x": d.shineX,
    "--gloss-shine-y": d.shineY,
  } as Record<string, string | number>;
}

/**
 * Multi-layer gloss box-shadow (rest / hover / press).
 * Always 5 layers — GSAP can smoothly interpolate hover ↔ press.
 */
export function buildGlossBoxShadow(element: HTMLElement, state: GlossDecorState): string {
  const insetTop = readGlossVar(element, "--gloss-inset-top");
  const insetBottom = readGlossVar(element, "--gloss-inset-bottom");
  const elevation = readGlossVar(element, "--gloss-elevation");
  const elevationHover =
    readGlossVar(element, "--gloss-elevation-hover") || elevation;
  const innerGlow = readGlossVar(element, "--gloss-inner-glow");
  const glowHover = readGlossVar(element, "--gloss-glow-hover");
  const pressInset = readGlossVar(element, "--gloss-press-inset");

  const base = `inset 0 0.425em 0.425em ${insetTop}, inset 0 -0.225em 0.225em ${insetBottom}`;

  /** Geometry like --shadow-base (rest) / --shadow-mid (hover), em ≈ px at 16px. */
  const elevationLayer =
    state === "hover"
      ? `0 0.125em 0.3125em -0.1875em ${elevationHover}`
      : state === "press"
        ? `0 0.04em 0.08em -0.0625em ${elevation}`
        : `0 0.0625em 0.125em -0.0625em ${elevation}`;

  const innerRing =
    state === "hover"
      ? `inset 0 0 0.1em 0.25em ${glowHover}`
      : `inset 0 0 0.05em 0.1em ${innerGlow}`;

  const pressLayer =
    state === "press"
      ? `inset 0 0.25em 0.06em 0 ${pressInset}`
      : "inset 0 0.25em 0.06em 0 rgb(0 0 0 / 0)";

  return `${base}, ${elevationLayer}, ${innerRing}, ${pressLayer}`;
}

function glossSurfaceProps(element: HTMLElement, state: GlossDecorState) {
  return {
    ...glossDecorVars(element, state),
    boxShadow: buildGlossBoxShadow(element, state),
  };
}

/** Instantly sets rest: scale=1, decor and gloss box-shadow. */
export function applyGlossInteractiveInstant(element: HTMLElement) {
  killMotion(element);
  gsap.set(element, {
    scale: 1,
    ...glossSurfaceProps(element, "rest"),
  });
}

let glossThemeRefreshObserver: MutationObserver | null = null;

/** Recalculates inline gloss shadows/decor with current theme CSS tokens. */
function refreshGlossInteractiveState(element: HTMLElement) {
  if (shouldSkipInteractiveHoverLift()) {
    applyGlossInteractiveInstant(element);
    return;
  }

  const lifted = element.matches(":hover") || element.matches(":focus-within");
  killMotion(element);

  if (lifted) {
    gsap.set(element, {
      scale: resolveAdaptiveHoverLiftScale(element),
      ...glossSurfaceProps(element, "hover"),
    });
    return;
  }

  applyGlossInteractiveInstant(element);
}

/** Refreshes all gloss interactives with `data-gloss-motion-init` (after theme change). */
export function refreshAllGlossInteractiveSurfaces(root: ParentNode = document) {
  if (typeof document === "undefined") return;
  root.querySelectorAll<HTMLElement>(`[${GLOSS_INIT_ATTR}]`).forEach(refreshGlossInteractiveState);
}

function ensureGlossThemeRefreshObserver() {
  if (glossThemeRefreshObserver || typeof document === "undefined") return;

  glossThemeRefreshObserver = new MutationObserver((records) => {
    for (const record of records) {
      if (record.type === "attributes" && record.attributeName === "data-theme") {
        refreshAllGlossInteractiveSurfaces();
        return;
      }
    }
  });

  glossThemeRefreshObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
}

export function createGlossInteractiveRefCallback(
  ref: RefObject<HTMLElement | null>,
  enabled = true,
) {
  return (node: HTMLElement | null) => {
    ref.current = node;
    if (node && enabled) {
      ensureGlossThemeRefreshObserver();
      if (!node.hasAttribute(GLOSS_INIT_ATTR)) {
        node.setAttribute(GLOSS_INIT_ATTR, "");
        applyGlossInteractiveInstant(node);
      }
    }
  };
}

/** Rest state of gloss panel like `.gloss-btn` + merge with external ref. */
export function useMergedGlossPanelRef<T extends HTMLElement>(
  externalRef: Ref<T | null> | undefined,
  enabled = true,
) {
  const localRef = useRef<T | null>(null);
  const bindGlossRef = useMemo(
    () => createGlossInteractiveRefCallback(localRef, enabled),
    [enabled],
  );

  return useCallback(
    (node: T | null) => {
      bindGlossRef(node);
      localRef.current = node;
      if (typeof externalRef === "function") externalRef(node);
      else if (externalRef) externalRef.current = node;
    },
    [bindGlossRef, externalRef],
  );
}

/** Hover-lift + gloss box-shadow + decor (single tween, no killMotion conflict). */
export function animateGlossInteractiveHoverLift(
  element: HTMLElement,
  lifted: boolean,
  liftScale?: number,
): void {
  if (shouldSkipInteractiveHoverLift()) {
    if (!lifted) {
      killMotion(element);
      gsap.set(element, { scale: 1, ...glossSurfaceProps(element, "rest") });
    }
    return;
  }

  killMotion(element);
  const cfg = getMotionConfig();
  const state = lifted ? "hover" : "rest";
  const resolvedScale = lifted
    ? (liftScale !== undefined ? liftScale : resolveAdaptiveHoverLiftScale(element))
    : 1;

  gsap.to(element, {
    scale: resolvedScale,
    ...glossSurfaceProps(element, state),
    duration: cfg.interactiveDuration / 1000,
    ease: cfg.hoverLiftEase,
    overwrite: "auto",
  });
}

/** Press-squeeze + press gloss-shadow; immediate return to hover/rest in one timeline. */
export function animateGlossInteractivePressSqueeze(
  element: HTMLElement,
  pointerInside = false,
  liftScale?: number,
  onReleaseStart?: () => void,
): Promise<void> {
  if (prefersReducedInteractiveHoverLift()) {
    return Promise.resolve();
  }

  const cfg = getMotionConfig();
  if (!cfg.enablePressSqueeze) {
    onReleaseStart?.();
    if (!shouldSkipInteractiveHoverLift()) {
      animateGlossInteractiveHoverLift(element, pointerInside, liftScale);
    }
    return Promise.resolve();
  }

  killMotion(element);
  const squeeze = resolveAdaptivePressSqueezeScale(element);
  const total = (cfg.interactiveDuration * 1.15) / 1000;
  const pressIn = total * 0.3;
  const releaseOut = total * 1;

  const canHoverLift = !shouldSkipInteractiveHoverLift();
  const releaseToHover = pointerInside && canHoverLift;
  const releaseState = releaseToHover ? "hover" : "rest";
  const releaseScale = releaseToHover
    ? (liftScale !== undefined ? liftScale : resolveAdaptiveHoverLiftScale(element))
    : 1;

  return new Promise<void>((resolve) => {
    gsap
      .timeline({ onComplete: () => resolve() })
      .to(element, {
        ...glossSurfaceProps(element, "press"),
        scale: squeeze,
        duration: pressIn,
        ease: "power1.out",
        overwrite: "auto",
      })
      .add(() => {
        onReleaseStart?.();
      })
      .to(element, {
        ...glossSurfaceProps(element, releaseState),
        scale: releaseScale,
        duration: releaseOut,
        ease: cfg.hoverLiftEase,
        overwrite: "auto",
      });
  });
}

export function useGlossInteractiveHandlers(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean,
  options?: {
    pointerInsideRef?: RefObject<boolean>;
    liftScale?: number;
  },
) {
  const liftScale = options?.liftScale;
  const pointerInsideRef = options?.pointerInsideRef;

  useLayoutEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (el) applyGlossInteractiveInstant(el);
  }, [enabled, ref]);

  useEffect(() => {
    const el = ref.current;
    return () => {
      if (el) killMotion(el);
    };
  }, [ref]);

  return useMemo(() => {
    const onPointerOver = (e: ReactPointerEvent<HTMLElement>) => {
      if (!enabled || e.defaultPrevented) return;
      const c = e.currentTarget;
      if (!(e.target instanceof Node) || !c.contains(e.target)) return;
      if (!cameFromOutsideContainer(c, e.relatedTarget)) return;
      if (shouldSkipInteractiveHoverLift()) return;
      const el = ref.current;
      if (!el) return;
      if (pointerInsideRef) pointerInsideRef.current = true;
      animateGlossInteractiveHoverLift(el, true, liftScale);
    };

    const onPointerOut = (e: ReactPointerEvent<HTMLElement>) => {
      const c = e.currentTarget;
      const rt = e.relatedTarget;
      if (rt instanceof Node && c.contains(rt)) return;
      if (pointerInsideRef) pointerInsideRef.current = false;
      if (!enabled || shouldSkipInteractiveHoverLift()) return;
      const el = ref.current;
      if (!el) return;
      animateGlossInteractiveHoverLift(el, false, liftScale);
    };

    return { onPointerOver, onPointerOut };
  }, [enabled, liftScale, pointerInsideRef, ref]);
}

/** Field gloss shell: hover + focus-within lift equally. */
export function useGlossFieldShellMotion(
  shellRef: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const pointerInsideRef = useRef(false);
  const focusedRef = useRef(false);
  const pressingRef = useRef(false);

  const bindShellRef = useMemo(
    () => createGlossInteractiveRefCallback(shellRef, enabled),
    [shellRef, enabled],
  );

  const syncLift = useCallback(() => {
    const el = shellRef.current;
    if (!el || !enabled || shouldSkipInteractiveHoverLift()) return;
    const lifted = pointerInsideRef.current || focusedRef.current;
    animateGlossInteractiveHoverLift(el, lifted);
  }, [enabled, shellRef]);

  const pointerHandlers = useGlossInteractiveHandlers(shellRef, enabled, {
    pointerInsideRef,
  });

  useLayoutEffect(() => {
    if (!enabled) return;
    const el = shellRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    const ro = new ResizeObserver(() => {
      refreshGlossInteractiveState(el);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [enabled, shellRef]);

  const onShellPointerEnter = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      pointerHandlers.onPointerOver(e);
      if (focusedRef.current) syncLift();
    },
    [pointerHandlers, syncLift],
  );

  const onShellPointerLeave = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      pointerHandlers.onPointerOut(e);
      if (focusedRef.current) syncLift();
    },
    [pointerHandlers, syncLift],
  );

  const onShellFocusIn = useCallback(() => {
    if (!enabled) return;
    focusedRef.current = true;
    // focusin after pointerdown cancels squeeze via syncLift → killMotion
    if (pressingRef.current || pointerInsideRef.current) return;
    syncLift();
  }, [enabled, syncLift]);

  const onShellFocusOut = useCallback(
    (e: React.FocusEvent<HTMLElement>) => {
      if (!enabled) return;
      const shell = shellRef.current;
      if (shell && e.relatedTarget instanceof Node && shell.contains(e.relatedTarget)) {
        return;
      }
      focusedRef.current = false;
      syncLift();
    },
    [enabled, shellRef, syncLift],
  );

  const onShellPointerDown = useCallback(() => {
    if (!enabled) return;
    const el = shellRef.current;
    if (!el || prefersReducedInteractiveHoverLift()) return;
    pointerInsideRef.current = true;
    pressingRef.current = true;
    void animateGlossInteractivePressSqueeze(el, true).finally(() => {
      pressingRef.current = false;
    });
  }, [enabled, shellRef]);

  return {
    bindShellRef,
    shellHoverMotionClass: enabled ? GLOSS_INTERACTIVE_MOTION_CLASS : "",
    onShellPointerEnter,
    onShellPointerLeave,
    onShellFocusIn,
    onShellFocusOut,
    onShellPointerDown,
  };
}
