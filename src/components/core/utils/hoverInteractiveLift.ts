/**
 * Hover lift and press squeeze — GSAP;
 * Hover lift registry matches `Button` (`animateInteractiveHoverLift`, `shouldSkipInteractiveHoverLift`).
 *
 * Shadows (when configured): used `boxShadow` (probed from CSS `--shadow-*`) in the
 * **same** tween as scale — gloss-style timing, CSS cascade as the shadow SSOT.
 */

import { useCallback, type RefObject } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

import { gsap, killMotion } from "./gsapMotion";
import { getMotionConfig, isMotionFeatureEnabled, motionPressSqueezeTotal } from "./motionConfig";
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
 * Collapsed shadow GSAP can morph from/to (browser `none` is not interpolable).
 * Two layers — matches token `--shadow-none` (key + ambient).
 */
const SHADOW_NONE_CONCRETE =
  "0px 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px 0px rgba(0, 0, 0, 0)";

/**
 * Shadow tiers for lift / press. Values are live `var(--shadow-*)` refs.
 *
 * **SSOT = CSS cascade** (`--shadow-*` + knobs in `tokens/styles.css` / theme).
 * Consumers tune via theme knobs or by overriding `--shadow-small|base|mid|large`.
 * GSAP never re-implements the formula — it probes the **used** `box-shadow`
 * so overrides and light/dark stay in sync (unlike gloss layers, which are JS-built).
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

function normalizePaintedBoxShadow(value: string): string {
  const v = value.trim();
  if (!v || v === "none") return SHADOW_NONE_CONCRETE;
  return v;
}

/** Shared probe for resolving CSS `var()` / `calc()` box-shadow to a concrete used value. */
let sharedShadowProbe: HTMLSpanElement | null = null;

function getSharedShadowProbe(): HTMLSpanElement {
  if (typeof document === "undefined") {
    throw new Error("resolveConcreteBoxShadow requires a document");
  }
  if (!sharedShadowProbe) {
    sharedShadowProbe = document.createElement("span");
    sharedShadowProbe.setAttribute("aria-hidden", "true");
    sharedShadowProbe.setAttribute("data-burne-shadow-probe", "");
    sharedShadowProbe.style.cssText =
      "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none;visibility:hidden;";
  }
  return sharedShadowProbe;
}

/**
 * Resolve any `box-shadow` CSS value (token `var(--shadow-*)`, custom, or concrete)
 * to a used string GSAP can interpolate. Uses one shared probe under `element` so local
 * / root theme knobs and `--shadow-*` overrides apply.
 */
export function resolveConcreteBoxShadow(element: HTMLElement, shadow: string): string {
  if (typeof document === "undefined") return SHADOW_NONE_CONCRETE;

  const trimmed = shadow.trim();
  if (!trimmed || trimmed === "none") return SHADOW_NONE_CONCRETE;
  if (!trimmed.includes("var(") && !trimmed.includes("calc(")) {
    return trimmed;
  }

  const probe = getSharedShadowProbe();
  probe.style.boxShadow = trimmed;
  const host = element.isConnected ? element : document.documentElement;
  if (probe.parentNode !== host) {
    host.appendChild(probe);
  }
  const computed = getComputedStyle(probe).boxShadow;
  // Keep probe in document for reuse; park on root so disconnected hosts do not leak.
  if (host !== document.documentElement) {
    document.documentElement.appendChild(probe);
  }
  return normalizePaintedBoxShadow(computed);
}

/**
 * Token tier → used box-shadow from the live CSS cascade (knobs / theme / overrides).
 */
export function buildTokenBoxShadow(element: HTMLElement, size: ShadowSize): string {
  return resolveConcreteBoxShadow(element, shadowCssVar(size));
}

/** Declared CSS custom-property value for a tier (docs / non-GSAP). */
export function readShadowSize(size: ShadowSize, from?: Element | null): string {
  if (size === "none") return readShadowVar("--shadow-none", from);
  return readShadowVar(SHADOW_CSS_VAR[size], from);
}

/** Config / `--el-shadow` value → concrete box-shadow for GSAP. */
function resolveShadowForGsap(element: HTMLElement, shadow: string): string {
  return resolveConcreteBoxShadow(element, shadow);
}

/**
 * Drop GSAP/inline `boxShadow` so `animate-shadow` paints via
 * `box-shadow: var(--el-shadow)` and theme knobs update live at rest / after tween.
 */
function releaseInlineBoxShadow(element: HTMLElement): void {
  element.style.removeProperty("box-shadow");
  gsap.set(element, { clearProps: "boxShadow" });
}

/**
 * Current painted box-shadow before starting a tween.
 * Prefer live inline (interrupted tween), else probe `--el-shadow` / computed CSS.
 */
function readPaintedBoxShadow(element: HTMLElement): string {
  const inline = element.style.boxShadow.trim();
  if (inline && !inline.includes("var(") && !inline.includes("calc(")) {
    return normalizePaintedBoxShadow(inline);
  }
  const gsapValue = String(gsap.getProperty(element, "boxShadow") ?? "").trim();
  if (
    gsapValue &&
    !gsapValue.includes("var(") &&
    !gsapValue.includes("calc(") &&
    gsapValue !== "none"
  ) {
    return normalizePaintedBoxShadow(gsapValue);
  }
  const elShadow = element.style.getPropertyValue("--el-shadow").trim();
  if (elShadow) return resolveConcreteBoxShadow(element, elShadow);
  return normalizePaintedBoxShadow(getComputedStyle(element).boxShadow);
}

type TweenScaleAndShadowOptions = {
  timeline?: gsap.core.Timeline;
  /**
   * After the tween: write `--el-shadow` and clear inline so CSS tracks knobs.
   * `false` for press-in (release segment commits).
   */
  commitShadow?: boolean;
};

/**
 * Scale + shadow in one `fromTo`. Concrete inline `boxShadow` only for the tween;
 * on commit, CSS `var(--el-shadow)` takes over again (live theme knobs).
 */
function tweenScaleAndShadow(
  element: HTMLElement,
  scale: number,
  shadowVar: string | null,
  duration: number,
  ease: string,
  options?: TweenScaleAndShadowOptions,
): void {
  const timeline = options?.timeline;
  const commitShadow = options?.commitShadow !== false;
  const transform = { ...INTERACTIVE_TRANSFORM_VARS, overwrite: "auto" as const };

  if (!shadowVar) {
    const vars = { scale, duration, ease, ...transform };
    if (timeline) timeline.to(element, vars);
    else gsap.to(element, vars);
    return;
  }

  const fromShadow = readPaintedBoxShadow(element);
  const toShadow = resolveShadowForGsap(element, shadowVar);
  const fromScale = Number(gsap.getProperty(element, "scale")) || 1;

  const from = { scale: fromScale, boxShadow: fromShadow };
  const to = {
    scale,
    boxShadow: toShadow,
    duration,
    ease,
    ...transform,
    onComplete: commitShadow
      ? () => {
          element.style.setProperty("--el-shadow", shadowVar);
          releaseInlineBoxShadow(element);
        }
      : undefined,
  };

  if (timeline) timeline.fromTo(element, from, to);
  else gsap.fromTo(element, from, to);
}

/**
 * Persistent / idle shadow: only `--el-shadow` token ref — no concrete inline.
 * `animate-shadow` paints via CSS so theme knobs apply immediately.
 * GSAP probes a concrete from-value when a lift/press tween starts.
 */
export function initElementShadow(element: HTMLElement | null, shadow: string): void {
  if (!element) return;
  element.style.setProperty("--el-shadow", shadow);
  releaseInlineBoxShadow(element);
}

function isTouchOrNarrowViewport(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(TOUCH_OR_NARROW_VIEWPORT_MQL).matches;
}

/** Hover lift and shadow change: off for reduced-motion, touch and viewport ≤ tablet. */
export function shouldSkipInteractiveHoverLift(): boolean {
  return (
    prefersReducedMotion() ||
    isTouchOrNarrowViewport() ||
    !isMotionFeatureEnabled("enableHoverLift")
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

export function resolveAdaptiveHoverLiftScale(element: HTMLElement): number {
  return adaptiveHoverLiftScale(element);
}

export function resolveAdaptivePressSqueezeScale(element: HTMLElement): number {
  return adaptiveSqueezeScale(element);
}

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
 * Hover-lift + optional shadow in one GSAP tween (same structure as gloss).
 * Replay while already inside is prevented by pointerover/out guards
 * (`cameFromOutsideContainer`) — not by a local lifted-state flag (that desynced
 * with press-squeeze release).
 */
export function animateInteractiveHoverLift(
  element: HTMLElement,
  lifted: boolean,
  liftScale?: number,
  shadow?: HoverShadowConfig,
): void {
  const shadowVar = shadow
    ? lifted
      ? shadow.hover
      : (shadow.idle ?? shadowNone())
    : null;

  if (shouldSkipInteractiveHoverLift()) {
    if (!lifted) {
      killMotion(element);
      if (shadowVar) {
        element.style.setProperty("--el-shadow", shadowVar);
        releaseInlineBoxShadow(element);
      }
      gsap.set(element, { scale: 1, ...INTERACTIVE_TRANSFORM_VARS });
    }
    return;
  }

  killMotion(element);
  const resolvedScale = lifted
    ? (liftScale !== undefined ? liftScale : adaptiveHoverLiftScale(element))
    : 1;
  const cfg = getMotionConfig();

  tweenScaleAndShadow(
    element,
    resolvedScale,
    shadowVar,
    cfg.interactiveDuration / 1000,
    cfg.hoverLiftEase,
  );
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
  liftScale?: number;
  shadow?: HoverShadowConfig;
  onReleaseStart?: () => void;
};

function resolvePointerInside(
  value: AnimateInteractivePressSqueezeOptions["pointerInside"],
): boolean {
  if (value == null) return false;
  if (typeof value === "function") return Boolean(value());
  if (typeof value === "object") return Boolean(value.current);
  return Boolean(value);
}

/**
 * Press-squeeze + optional shadow in the same tweens as scale (gloss-style timeline).
 */
export function animateInteractivePressSqueeze(
  element: HTMLElement,
  options?: AnimateInteractivePressSqueezeOptions,
): Promise<void> {
  if (!isMotionFeatureEnabled("enablePressSqueeze")) {
    options?.onReleaseStart?.();
    return Promise.resolve();
  }
  killMotion(element);
  const s = adaptiveSqueezeScale(element);
  const cfg = getMotionConfig();
  const total = motionPressSqueezeTotal();
  // Intentional timeline split: press-in 30%; release = full total when restoring hover,
  // else 50% of total. See SETUP.md «Intentional motion constants».
  const pressIn = total * 0.3;
  const canHoverLift = !shouldSkipInteractiveHoverLift();
  const shadow = options?.shadow;
  const idleShadowVar = shadow ? (shadow.idle ?? shadowNone()) : null;
  const pressShadowVar = shadow ? (shadow.press ?? idleShadowVar) : null;

  return new Promise((resolve) => {
    const tl = gsap.timeline({
      onComplete: () => {
        resolve();
      },
    });
    tweenScaleAndShadow(element, s, pressShadowVar, pressIn, "power1.out", {
      timeline: tl,
      commitShadow: false,
    });
    tl.add(() => {
      const releaseToHover =
        resolvePointerInside(options?.pointerInside) && canHoverLift;
      const releaseScale = releaseToHover
        ? options?.liftScale !== undefined
          ? options.liftScale
          : adaptiveHoverLiftScale(element)
        : 1;
      const releaseOut = releaseToHover ? total : total * 0.5;
      const releaseEase = releaseToHover ? cfg.hoverLiftEase : "sine.inOut";
      const releaseShadowVar =
        shadow && idleShadowVar != null
          ? releaseToHover
            ? shadow.hover
            : idleShadowVar
          : null;

      options?.onReleaseStart?.();
      tweenScaleAndShadow(element, releaseScale, releaseShadowVar, releaseOut, releaseEase, {
        timeline: tl,
        commitShadow: true,
      });
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
  const onEnter = useCallback(
    (el: HTMLElement) => {
      animateInteractiveHoverLift(el, true, liftScale, shadow);
    },
    [liftScale, shadow],
  );

  const onLeave = useCallback(
    (el: HTMLElement) => {
      animateInteractiveHoverLift(el, false, liftScale, shadow);
    },
    [liftScale, shadow],
  );

  return useContainerPointerHoverHandlers<Element>({
    enabled,
    targetRef: liftedRef,
    pointerInsideRef,
    skipHover: shouldSkipInteractiveHoverLift,
    onEnter,
    onLeave,
  });
}
