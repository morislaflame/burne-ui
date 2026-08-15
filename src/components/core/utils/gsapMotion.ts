/**
 * GSAP setup and shared motion helpers for Burne UI.
 *
 * Kit motion is event/state-driven (`killMotion` + `useEffect`/`useLayoutEffect`),
 * not `@gsap/react` / `useGSAP`. `gsap` is a peer dependency (external in the lib build).
 * `CustomEase` is registered lazily inside `ensureRippleEase` (no top-level side effect).
 */

import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

import { getMotionConfig } from "./motionConfig";

const RIPPLE_EASE_ID = "brn-ripple";

let customEaseRegistered = false;
let cachedRippleCss = "";

function ensureCustomEasePlugin(): void {
  if (customEaseRegistered) return;
  gsap.registerPlugin(CustomEase);
  customEaseRegistered = true;
}

/** Ensures CustomEase for ripple is registered from current motion config. */
export function ensureRippleEase(): string {
  ensureCustomEasePlugin();
  const css = getMotionConfig().rippleEaseCss;
  if (cachedRippleCss !== css) {
    const m = /cubic-bezier\(\s*([\d.]+),\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)\s*\)/.exec(css);
    if (m) {
      CustomEase.create(RIPPLE_EASE_ID, `${m[1]},${m[2]},${m[3]},${m[4]}`);
    } else {
      CustomEase.create(RIPPLE_EASE_ID, "0.25,0.55,0.35,0.95");
    }
    cachedRippleCss = css;
  }
  return RIPPLE_EASE_ID;
}

/**
 * Stops active tweens/timelines on target(s) via `killTweensOf`.
 * Clears inline `will-change` on HTMLElement targets (dynamic hint left mid-tween).
 * Does not clear other inline styles — callers that need a clean slate must reset
 * (`style.transform = ""`, `gsap.set(..., { clearProps })`, etc.) themselves.
 */
export function killMotion(...targets: gsap.TweenTarget[]): void {
  gsap.killTweensOf(targets);
  for (const target of targets) clearWillChangeTransformDeep(target);
}

/** Geometry props kit fill / thumb loops tween — not opacity / autoAlpha (slot enter). */
const MOTION_GEOMETRY_PROPS =
  "width,height,x,y,scale,scaleX,scaleY,rotation,rotate,transform";

/**
 * Stops geometry tweens on a target without killing opacity/autoAlpha enter.
 * Not a public `burne-ui` / `internal` export.
 */
export function killMotionGeometry(target: object): void {
  gsap.killTweensOf(target, MOTION_GEOMETRY_PROPS);
  if (typeof HTMLElement !== "undefined" && target instanceof HTMLElement) {
    setWillChangeTransform(target, false);
  }
}

/**
 * Resolve a CSS color (token, `var(--color-*)`, named, hex) to a computed
 * rgb/oklch string in `el`'s theme context. GSAP cannot interpolate
 * `var(--color-primary)` → `rgb(...)` — that snaps and flashes.
 */
export function resolveCssColor(el: HTMLElement, color: string): string {
  const probe = document.createElement("span");
  probe.setAttribute("aria-hidden", "true");
  probe.style.cssText =
    "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none;visibility:hidden";
  probe.style.color = color;
  el.appendChild(probe);
  const resolved = getComputedStyle(probe).color;
  probe.remove();
  return resolved || color;
}

export type TweenCssColorOptions = {
  duration?: number;
  ease?: string;
  /** After the tween, drop the inline color so the CSS class owns it again. */
  clearOnComplete?: boolean;
  onComplete?: () => void;
};

/**
 * Tween `color` via computed rgb values so CSS variables don't flash on reverse.
 */
export function tweenCssColor(
  el: HTMLElement,
  to: string,
  options: TweenCssColorOptions = {},
) {
  const from = getComputedStyle(el).color;
  const end = resolveCssColor(el, to);
  return gsap.fromTo(
    el,
    { color: from },
    {
      color: end,
      duration: options.duration ?? 0.25,
      ease: options.ease,
      overwrite: "auto",
      force3D: false,
      onComplete: () => {
        if (options.clearOnComplete) {
          gsap.set(el, { clearProps: "color" });
        }
        options.onComplete?.();
      },
    },
  );
}

/**
 * Dynamic compositor hint for transform tweens.
 * Prefer over permanent Tailwind `will-change-transform` (avoids idle layer promotion).
 * Do not use for short interactive scale/x tweens (hover-lift, press-squeeze, Switch thumb) —
 * with fractional control sizes, promoting a layer causes a visible 1px snap. Those paths use
 * GSAP `force3D: false` instead.
 */
export function setWillChangeTransform(el: HTMLElement, active: boolean): void {
  el.style.willChange = active ? "transform" : "";
}

function clearWillChangeTransformDeep(target: unknown): void {
  if (typeof HTMLElement !== "undefined" && target instanceof HTMLElement) {
    setWillChangeTransform(target, false);
    return;
  }
  if (Array.isArray(target)) {
    for (const item of target) clearWillChangeTransformDeep(item);
  }
}

/**
 * Wraps a GSAP `onComplete` so `will-change` is cleared when the tween/timeline ends.
 * Call `setWillChangeTransform(el, true)` before starting the animation.
 */
export function clearWillChangeOnComplete(
  el: HTMLElement,
  onComplete?: gsap.Callback,
): gsap.Callback {
  return function (this: gsap.core.Animation) {
    setWillChangeTransform(el, false);
    if (typeof onComplete === "function") {
      return (onComplete as (this: gsap.core.Animation) => void).call(this);
    }
  };
}

export { gsap };
