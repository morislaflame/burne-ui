/**
 * Hover lift and press squeeze — GSAP.
 * Hover lift registry matches `Button` (`animateInteractiveHoverLift`, `shouldSkipInteractiveHoverLift`).
 *
 * Shadows stay on static fade layers. GSAP tweens layer opacity and element scale.
 */
 
import { useCallback, type RefObject } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
 
import { ensureShadowFadeHost, playShadowFade, snapShadowFade } from "./shadowFade";
import { gsap } from "./gsapMotion";
import { bindAbortSignal } from "./bindAbortSignal";
import { useMotionConfig } from "./motionConfigContext";
import {
  isMotionFeatureEnabledFor,
  motionPressSqueezeTotalFor,
  resolveMotionConfig,
  type MotionConfig,
} from "./motionConfig";
import { prefersReducedMotion } from "./reducedMotion";
import { useContainerPointerHoverHandlers } from "./useContainerPointerHoverHandlers";
import {
  SHADOW_CSS_VAR,
  SHADOW_LIFT_CSS_VAR,
  type ShadowInteraction,
  type ShadowSize,
} from "@/tokens/shadows";
import { TOUCH_OR_NARROW_VIEWPORT_MQL } from "@/tokens/breakpoints";
 
/**
 * Short interactive scale tweens stay on the 2D transform path.
 * Default GSAP `force3D` + dynamic `will-change` promote a compositor layer and
 * cause a 1px size/text snap on fractional control sizes (theme shuffle).
 */
const INTERACTIVE_TRANSFORM_VARS = { force3D: false } as const;

/**
 * Shadow tiers for lift / press. Values are live `var(--shadow-*)` refs.
 *
 * **SSOT = CSS cascade** (`--shadow-*` + knobs in `tokens/styles.css` / theme).
 * Consumers tune via theme knobs or by overriding `--shadow-small|base|mid|large`.
 * Fade layers paint those tokens; GSAP only cross-fades their opacity.
 */
export interface HoverShadowConfig {
  /**
   * Rest shadow (second level — base; hover-only — omit / `shadowNone`).
   * If undefined — `shadowNone()` is used.
   */
  idle?: string;
  /** Hover shadow. */
  hover: string;
  /**
   * Press-squeezed shadow.
   * Defaults to `idle` (or `shadowNone`) — step down from hover.
   */
  press?: string;
}
 
function resolveShadowReadRoot(from?: Element | null): Element {
  if (from) return from;
  return document.documentElement;
}
 
/** Reads a computed shadow CSS variable from `from`'s cascade (or document root). */
export function readShadowVar(varName: string, from?: Element | null): string {
  if (typeof window === "undefined") return "none";
  return (
    getComputedStyle(resolveShadowReadRoot(from)).getPropertyValue(varName).trim() ||
    "none"
  );
}
 
/**
 * Live CSS `var(--shadow-*)` for `--el-shadow` / motion config.
 * - sized + `rest` → `--shadow-small|base|mid|large`
 * - sized + `hover|press` → `--shadow-{size}-hover|press` (same family)
 * - `none` + `hover` → `--shadow-lift` (first-level appear; not a sized rest token)
 */
export function shadowCssVar(
  size: ShadowSize,
  interaction: ShadowInteraction = "rest",
): string {
  if (size === "none") {
    if (interaction === "hover") return `var(${SHADOW_LIFT_CSS_VAR})`;
    return "var(--shadow-none)";
  }
  if (interaction === "rest") return `var(${SHADOW_CSS_VAR[size]})`;
  return `var(--shadow-${size}-${interaction})`;
}
 
export const shadowNone = () => shadowCssVar("none");
export const shadowSmall = () => shadowCssVar("small");
export const shadowBase = () => shadowCssVar("base");
export const shadowMid = () => shadowCssVar("mid");
export const shadowLarge = () => shadowCssVar("large");
/** First-level hover appear (Button) — `var(--shadow-lift)`. */
export const shadowLift = () => shadowCssVar("none", "hover");
 
/** Declared CSS custom-property value for a tier (docs / non-GSAP). */
export function readShadowSize(size: ShadowSize, from?: Element | null): string {
  if (size === "none") return readShadowVar("--shadow-none", from);
  return readShadowVar(SHADOW_CSS_VAR[size], from);
}

/** Drop a leftover inline shadow so fade layers and `--el-shadow` own the paint. */
function clearInlineBoxShadow(element: HTMLElement): void {
  element.style.removeProperty("box-shadow");
}

function tweenScale(
  element: HTMLElement,
  scale: number,
  duration: number,
  ease: string,
  timeline?: gsap.core.Timeline,
): void {
  const vars = {
    scale,
    duration,
    ease,
    ...INTERACTIVE_TRANSFORM_VARS,
    overwrite: "auto" as const,
  };
  if (timeline) timeline.to(element, vars);
  else gsap.to(element, vars);
}
 
/**
 * Persistent / idle shadow: `--el-shadow` token ref, painted by the rest fade layer.
 */
export function initElementShadow(element: HTMLElement | null, shadow: string): void {
  if (!element) return;
  element.style.setProperty("--el-shadow", shadow);
  element.style.setProperty("--shadow-fade-rest", shadow);
  clearInlineBoxShadow(element);
  ensureShadowFadeHost(element);
  snapShadowFade(element, "rest");
}
 
function isTouchOrNarrowViewport(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(TOUCH_OR_NARROW_VIEWPORT_MQL).matches;
}
 
/** Hover lift and shadow change: off for reduced-motion, touch and viewport ≤ tablet. */
export function shouldSkipInteractiveHoverLift(config?: Readonly<MotionConfig>): boolean {
  return (
    prefersReducedMotion() ||
    isTouchOrNarrowViewport() ||
    !isMotionFeatureEnabledFor(resolveMotionConfig(config), "enableHoverLift")
  );
}
 
/** Absolute pixel offset — squeeze "feel" in px from each side. Intentional constant. */
const ADAPTIVE_SQUEEZE_TARGET_PX = 2.4;
/** Minimally noticeable squeeze (very large elements). Intentional constant. */
const ADAPTIVE_SQUEEZE_MIN_DELTA = 0.003;
/** Absolute pixel offset for hover lift. Intentional constant. */
const ADAPTIVE_LIFT_TARGET_PX = 1.8;
/** Minimally noticeable lift. Intentional constant. */
const ADAPTIVE_LIFT_MIN_DELTA = 0.002;
 
function adaptiveSqueezeScale(element: HTMLElement, config?: Readonly<MotionConfig>): number {
  const { width, height } = element.getBoundingClientRect();
  const maxDim = Math.max(width, height, 1);
  const baseDelta = 1 - (resolveMotionConfig(config).pressSqueezeScale[1] as number);
  const delta = Math.min(
    Math.max(ADAPTIVE_SQUEEZE_TARGET_PX / maxDim, ADAPTIVE_SQUEEZE_MIN_DELTA),
    baseDelta,
  );
  return 1 - delta;
}
 
export function resolveAdaptiveHoverLiftScale(
  element: HTMLElement,
  config?: Readonly<MotionConfig>,
): number {
  return adaptiveHoverLiftScale(element, config);
}
 
export function resolveAdaptivePressSqueezeScale(
  element: HTMLElement,
  config?: Readonly<MotionConfig>,
): number {
  return adaptiveSqueezeScale(element, config);
}
 
function adaptiveHoverLiftScale(element: HTMLElement, config?: Readonly<MotionConfig>): number {
  const { width, height } = element.getBoundingClientRect();
  const maxDim = Math.max(width, height, 1);
  const delta = Math.min(
    Math.max(ADAPTIVE_LIFT_TARGET_PX / maxDim, ADAPTIVE_LIFT_MIN_DELTA),
    resolveMotionConfig(config).hoverLiftScale - 1,
  );
  return 1 + delta;
}
 
/**
 * Hover-lift + optional shadow in one GSAP tween (same structure as ).
 * Replay while already inside is prevented by pointerover/out guards
 * (`cameFromOutsideContainer`) — not by a local lifted-state flag (that desynced
 * with press-squeeze release).
 */
export function animateInteractiveHoverLift(
  element: HTMLElement,
  lifted: boolean,
  liftScale?: number,
  shadow?: HoverShadowConfig,
  config?: Readonly<MotionConfig>,
): void {
  const shadowVar = shadow
    ? lifted
      ? shadow.hover
      : (shadow.idle ?? shadowNone())
    : null;
 
  if (shouldSkipInteractiveHoverLift(config)) {
    if (!lifted) {
      if (shadowVar) {
        element.style.setProperty("--el-shadow", shadowVar);
        clearInlineBoxShadow(element);
      }
      gsap.set(element, { scale: 1, overwrite: "auto", ...INTERACTIVE_TRANSFORM_VARS });
    }
    return;
  }

  const resolvedScale = lifted
    ? (liftScale !== undefined ? liftScale : adaptiveHoverLiftScale(element, config))
    : 1;
  const cfg = resolveMotionConfig(config);
  const duration = cfg.interactiveDuration / 1000;

  if (shadow) {
    element.style.setProperty("--shadow-fade-hover", shadow.hover);
    if (shadow.press) element.style.setProperty("--shadow-fade-press", shadow.press);
    if (!lifted) {
      const idle = shadow.idle ?? shadowNone();
      element.style.setProperty("--el-shadow", idle);
      element.style.setProperty("--shadow-fade-rest", idle);
    }
    playShadowFade(element, lifted ? "hover" : "rest", {
      duration,
      ease: cfg.hoverLiftEase,
    });
  }

  gsap.to(element, {
    scale: resolvedScale,
    duration,
    ease: cfg.hoverLiftEase,
    ...INTERACTIVE_TRANSFORM_VARS,
    overwrite: "auto",
  });
}
 
export function isInteractivePressKey(e: {
  key: string;
  repeat?: boolean;
}): boolean {
  return !e.repeat && (e.key === "Enter" || e.key === " ");
}
 
export type AnimateInteractivePressSqueezeOptions = {
  /**
   * Prefer a `RefObject` / getter — re-read at release so leave-during-press
   * does not restore hover shadow/scale after the cursor has left.
   */
  pointerInside?: boolean | RefObject<boolean | null> | (() => boolean);
  /** `false` releases to rest scale even if the pointer is still inside. */
  restoreHover?: boolean;
  liftScale?: number;
  shadow?: HoverShadowConfig;
  onReleaseStart?: () => void;
  /** When aborted, kill the timeline and skip `onReleaseStart` / release tween. */
  signal?: AbortSignal;
  config?: Readonly<MotionConfig>;
};
 
function resolvePointerInside(
  value: AnimateInteractivePressSqueezeOptions["pointerInside"],
): boolean {
  if (value == null) return false;
  if (typeof value === "function") return Boolean(value());
  if (typeof value === "object") return Boolean(value.current);
  return Boolean(value);
}

/** Owns the press timeline we started. A new press stops that timeline only. */
const stopActivePress = new WeakMap<HTMLElement, () => void>();

/**
 * Press-squeeze. Scale and the shadow fade share one timeline.
 * Shadow layers stay static; only their opacity moves.
 * Cancellation is the engine abort signal or the next press on this element —
 * not `killTweensOf`, so a leave tween on the same node keeps running.
 */
export function animateInteractivePressSqueeze(
  element: HTMLElement,
  options?: AnimateInteractivePressSqueezeOptions,
): Promise<void> {
  if (options?.signal?.aborted) return Promise.resolve();
  const cfg = resolveMotionConfig(options?.config);
  if (!isMotionFeatureEnabledFor(cfg, "enablePressSqueeze")) {
    options?.onReleaseStart?.();
    return Promise.resolve();
  }
  const s = adaptiveSqueezeScale(element, cfg);
  const total = motionPressSqueezeTotalFor(cfg);
  // Intentional timeline split: press-in 30%; release = full total when restoring hover,
  // else 50% of total. See SETUP.md «Intentional motion constants».
  const pressIn = total * 0.3;
  const pressEase = "power1.out";
  const canHoverLift = !shouldSkipInteractiveHoverLift(cfg);
  const shadow = options?.shadow;
  const idleShadowVar = shadow ? (shadow.idle ?? shadowNone()) : null;
  const pressShadowVar = shadow ? (shadow.press ?? idleShadowVar) : null;
  const signal = options?.signal;

  if (shadow && idleShadowVar && pressShadowVar) {
    element.style.setProperty("--shadow-fade-hover", shadow.hover);
    element.style.setProperty("--shadow-fade-rest", idleShadowVar);
    element.style.setProperty("--shadow-fade-press", pressShadowVar);
    clearInlineBoxShadow(element);
  }

  return new Promise((resolve) => {
    let settled = false;
    let unbind = () => {};
    let stop = () => {};
    const done = () => {
      if (settled) return;
      settled = true;
      if (stopActivePress.get(element) === stop) stopActivePress.delete(element);
      unbind();
      resolve();
    };

    const tl = gsap.timeline({
      onComplete: () => {
        done();
      },
    });
    stop = () => {
      tl.kill();
      done();
    };
    const previous = stopActivePress.get(element);
    stopActivePress.set(element, stop);
    previous?.();
    unbind = bindAbortSignal(signal, stop);
    tweenScale(element, s, pressIn, pressEase, tl);
    if (shadow) {
      playShadowFade(element, "press", {
        duration: pressIn,
        ease: pressEase,
        timeline: tl,
      });
    }
    tl.add(() => {
      if (signal?.aborted) return;
      const releaseToHover =
        options?.restoreHover !== false &&
        resolvePointerInside(options?.pointerInside) &&
        canHoverLift;
      const releaseScale = releaseToHover
        ? options?.liftScale !== undefined
          ? options.liftScale
          : adaptiveHoverLiftScale(element, cfg)
        : 1;
      const releaseOut = releaseToHover ? total : total * 0.5;
      const releaseEase = releaseToHover ? cfg.hoverLiftEase : "sine.inOut";
      options?.onReleaseStart?.();
      if (!releaseToHover && idleShadowVar) {
        element.style.setProperty("--el-shadow", idleShadowVar);
        element.style.setProperty("--shadow-fade-rest", idleShadowVar);
      }
      tweenScale(element, releaseScale, releaseOut, releaseEase, tl);
      if (shadow) {
        playShadowFade(element, releaseToHover ? "hover" : "rest", {
          duration: releaseOut,
          ease: releaseEase,
          timeline: tl,
        });
      }
    });
  });
}
 
export function useInteractiveHoverLiftContainerHandlers<
  Element extends HTMLElement = HTMLElement,
>(
  liftedRef: RefObject<HTMLElement | null>,
  enabled: boolean,
  pointerInsideRef?: RefObject<boolean>,
  liftScale?: number,
  shadow?: HoverShadowConfig,
): {
  onPointerOver: (e: ReactPointerEvent<Element>) => void;
  onPointerOut: (e: ReactPointerEvent<Element>) => void;
} {
  const config = useMotionConfig();
  const onEnter = useCallback(
    (el: HTMLElement) => {
      animateInteractiveHoverLift(el, true, liftScale, shadow, config);
    },
    [config, liftScale, shadow],
  );
 
  const onLeave = useCallback(
    (el: HTMLElement) => {
      animateInteractiveHoverLift(el, false, liftScale, shadow, config);
    },
    [config, liftScale, shadow],
  );
 
  return useContainerPointerHoverHandlers<Element>({
    enabled,
    targetRef: liftedRef,
    pointerInsideRef,
    skipHover: () => shouldSkipInteractiveHoverLift(config),
    onEnter,
    onLeave,
  });
}
 