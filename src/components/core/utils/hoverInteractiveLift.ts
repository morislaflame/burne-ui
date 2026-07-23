/**
 * Hover lift and press squeeze — GSAP;
 * Hover lift registry matches `Button` (`animateInteractiveHoverLift`, `shouldSkipInteractiveHoverLift`).
 */

import { useEffect, useMemo, type MutableRefObject, type RefObject } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

import { cameFromOutsideContainer } from "./cameFromOutsideContainer";
import { gsap, killMotion } from "./gsapMotion";
import { getMotionConfig } from "./motionConfig";
import { SHADOW_CSS_VAR, type ShadowSize } from "@/tokens/shadows";
import { TOUCH_OR_NARROW_VIEWPORT_MQL } from "@/tokens/breakpoints";

/**
 * `box-shadow` values for hover animation.
 * `null` means "do not animate shadow" (for outline / ghost variants).
 * Read from CSS variables (theme-aware), but GSAP needs a concrete string —
 * so pass them explicitly via `getComputedStyle` at call time.
 */
export interface HoverShadowConfig {
  /**
   * box-shadow at rest (second level — base; hover-only — see `shadowNone`).
   * If undefined — `shadowNone()` is used (not `none`: otherwise transition breaks).
   */
  idle?: string;
  /** box-shadow on hover. */
  hover: string;
}

/** Reads shadow CSS variable from document root. */
function readShadowVar(varName: string): string {
  if (typeof window === "undefined") return "none";
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || "none";
}

/** "Empty" shadow: visually shadowless, but interpolates with `--shadow-base`. */
export const shadowNone = () => readShadowVar("--shadow-none");

export const shadowBase = () => readShadowVar(SHADOW_CSS_VAR.base);
export const shadowMid = () => readShadowVar(SHADOW_CSS_VAR.mid);
export const shadowLarge = () => readShadowVar(SHADOW_CSS_VAR.large);

/** `box-shadow` value for a shadow tier from the current theme. */
export function readShadowSize(size: ShadowSize): string {
  if (size === "none") return shadowNone();
  return readShadowVar(SHADOW_CSS_VAR[size]);
}

/**
 * Sets `--el-shadow` on the element (inline, overrides local `animate-shadow` reset).
 * Call after mount for components with a persistent shadow (Alert, Badge, Tooltip).
 * For hover-only shadow, `animate-shadow` class is enough (idle = `--shadow-none`).
 */
export function initElementShadow(element: HTMLElement | null, shadow: string): void {
  if (!element) return;
  element.style.setProperty("--el-shadow", shadow);
}


export function prefersReducedInteractiveHoverLift(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Viewport ≤ tablet (Tailwind `lg`), touch without hover or coarse pointer — no hover-lift. */
function isTouchOrNarrowViewport(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(TOUCH_OR_NARROW_VIEWPORT_MQL).matches;
}

/** Hover lift and shadow change: off for reduced-motion, touch and viewport ≤ tablet. */
export function shouldSkipInteractiveHoverLift(): boolean {
  return prefersReducedInteractiveHoverLift() || isTouchOrNarrowViewport() || !getMotionConfig().enableHoverLift;
}

//
// Instead of a fixed squeeze/lift percentage, use a fixed
// absolute pixel offset. This feels right at any size:
//
//   scale_delta = TARGET_PX / max(width, height)
//
// Small button     (120 × 36): delta = 2.4 / 120 = 0.020 → squeeze 0.980
// Wide input       (280 × 40): delta = 2.4 / 280 = 0.009 → squeeze 0.991
// Disclosure       (500 × 48): delta = 2.4 / 500 = 0.005 → squeeze 0.995
// Full-width       (1200 × 60): delta = 2.4 / 1200 = 0.002 → squeeze 0.998
//
// Upper bound = original fixed default (preserves small-button behavior).
// Lower bound = always noticeable but non-zero motion.

/** Absolute pixel offset — squeeze "feel" in px from each side. */
const ADAPTIVE_SQUEEZE_TARGET_PX = 2.4;
/** Minimally noticeable squeeze (very large elements). */
const ADAPTIVE_SQUEEZE_MIN_DELTA = 0.003;

/** Absolute pixel offset for hover lift. */
const ADAPTIVE_LIFT_TARGET_PX = 1.8;
/** Minimally noticeable lift. */
const ADAPTIVE_LIFT_MIN_DELTA = 0.002;

function adaptiveSqueezeScale(element: HTMLElement): number {
  const { width, height } = element.getBoundingClientRect();
  const maxDim = Math.max(width, height, 1);
  const baseDelta = 1 - (getMotionConfig().pressSqueezeScale[1] as number);
  const delta = Math.min(
    Math.max(ADAPTIVE_SQUEEZE_TARGET_PX / maxDim, ADAPTIVE_SQUEEZE_MIN_DELTA),
    baseDelta,
  );
  return 1 - delta;
}

/** Adaptive scale for hover-lift (for gloss-combined motion). */
export function resolveAdaptiveHoverLiftScale(element: HTMLElement): number {
  return adaptiveHoverLiftScale(element);
}

/** Adaptive scale for press-squeeze (for gloss-combined motion). */
export function resolveAdaptivePressSqueezeScale(element: HTMLElement): number {
  return adaptiveSqueezeScale(element);
}

/**
 * Returns scale > 1 for hover-lift, adapted to the element's actual size.
 * Pass explicit `liftScale` to override (e.g. Badge.Anchor).
 */
function adaptiveHoverLiftScale(element: HTMLElement): number {
  const { width, height } = element.getBoundingClientRect();
  const maxDim = Math.max(width, height, 1);
  const delta = Math.min(
    Math.max(ADAPTIVE_LIFT_TARGET_PX / maxDim, ADAPTIVE_LIFT_MIN_DELTA),
    getMotionConfig().hoverLiftScale - 1,
  );
  return 1 + delta;
}


/**
 * Stops active tweens, then smoothly scales by scale only (no translation).
 * If `liftScale` is omitted — computed adaptively from element size.
 * Optional: `shadow` — config for smooth `box-shadow` change along with scale.
 */
export function animateInteractiveHoverLift(
  element: HTMLElement,
  lifted: boolean,
  liftScale?: number,
  shadow?: HoverShadowConfig,
): void {
  if (shouldSkipInteractiveHoverLift()) {
    if (!lifted) {
      killMotion(element);
      gsap.set(element, { scale: 1 });
      if (shadow) {
        element.style.setProperty("--el-shadow", shadow.idle ?? shadowNone());
      }
    }
    return;
  }

  killMotion(element);
  const resolvedScale = lifted
    ? (liftScale !== undefined ? liftScale : adaptiveHoverLiftScale(element))
    : 1;
  const cfg = getMotionConfig();
  gsap.to(element, {
    scale: resolvedScale,
    duration: cfg.interactiveDuration / 1000,
    ease: cfg.hoverLiftEase,
    overwrite: "auto",
  });
  if (shadow) {
    const idle = shadow.idle ?? shadowNone();
    element.style.setProperty("--el-shadow", lifted ? shadow.hover : idle);
  }
}

/**
 * Short squeeze impulse on pointer down.
 * Squeeze amount adapts automatically to element size.
 * Returns a promise that resolves when the animation ends.
 *
 * With `pointerInside` and active hover-lift, release goes straight to hover-scale
 * (no pause at scale 1 and no separate hover tween).
 */
export type AnimateInteractivePressSqueezeOptions = {
  pointerInside?: boolean;
  liftScale?: number;
  shadow?: HoverShadowConfig;
  /** Called at the start of the release phase (before tween to rest/hover). */
  onReleaseStart?: () => void;
};

export function animateInteractivePressSqueeze(
  element: HTMLElement,
  options?: AnimateInteractivePressSqueezeOptions,
): Promise<void> {
  if (!getMotionConfig().enablePressSqueeze) {
    options?.onReleaseStart?.();
    return Promise.resolve();
  }
  killMotion(element);
  const s = adaptiveSqueezeScale(element);
  const cfg = getMotionConfig();
  const total = (cfg.interactiveDuration * 1.15) / 1000;
  const pressIn = total * 0.3;

  const canHoverLift = !shouldSkipInteractiveHoverLift();
  const releaseToHover = Boolean(options?.pointerInside && canHoverLift);
  const releaseScale = releaseToHover
    ? (options?.liftScale !== undefined ? options.liftScale : adaptiveHoverLiftScale(element))
    : 1;
  const releaseOut = releaseToHover ? total : total * 0.5;
  const releaseEase = releaseToHover ? cfg.hoverLiftEase : "sine.inOut";
  const shadow = options?.shadow;

  if (shadow) {
    const idle = shadow.idle ?? shadowNone();
    element.style.setProperty("--el-shadow", releaseToHover ? shadow.hover : idle);
  }

  return new Promise((resolve) => {
    gsap
      .timeline({
        onComplete: () => {
          gsap.set(element, { scale: releaseScale });
          resolve();
        },
      })
      .to(element, {
        scale: s,
        duration: pressIn,
        ease: "power1.out",
        overwrite: "auto",
      })
      .add(() => {
        options?.onReleaseStart?.();
      })
      .to(element, {
        scale: releaseScale,
        duration: releaseOut,
        ease: releaseEase,
        overwrite: "auto",
      });
  });
}

export function useInteractiveHoverLiftContainerHandlers<
  Element extends HTMLElement = HTMLElement,
>(
  liftedRef: RefObject<HTMLElement | null>,
  enabled: boolean,
  pointerInsideRef?: MutableRefObject<boolean>,
  /** Explicit lift scale; `undefined` (default) — adaptive by element size. */
  liftScale?: number,
  shadow?: HoverShadowConfig,
): {
  onPointerOver: (e: ReactPointerEvent<Element>) => void;
  onPointerOut: (e: ReactPointerEvent<Element>) => void;
} {
  useEffect(() => {
    const t = liftedRef.current;
    return () => {
      if (t) killMotion(t);
    };
  }, [liftedRef]);

  return useMemo(() => {
    const onPointerOver = (e: ReactPointerEvent<Element>) => {
      if (!enabled) return;
      if (e.defaultPrevented) return;
      const c = e.currentTarget;
      if (!(e.target instanceof Node) || !c.contains(e.target)) return;
      if (!cameFromOutsideContainer(c, e.relatedTarget)) return;
      if (shouldSkipInteractiveHoverLift()) return;
      const t = liftedRef.current;
      if (!t) return;
      if (pointerInsideRef) pointerInsideRef.current = true;
      animateInteractiveHoverLift(t, true, liftScale, shadow);
    };

    const onPointerOut = (e: ReactPointerEvent<Element>) => {
      const c = e.currentTarget;
      const rt = e.relatedTarget;
      if (rt instanceof Node && c.contains(rt)) return;

      if (pointerInsideRef) pointerInsideRef.current = false;
      if (!enabled) return;
      if (shouldSkipInteractiveHoverLift()) return;
      const t = liftedRef.current;
      if (!t) return;
      animateInteractiveHoverLift(t, false, liftScale, shadow);
    };

    return { onPointerOver, onPointerOut };
  }, [liftedRef, enabled, pointerInsideRef, liftScale, shadow]);
}

