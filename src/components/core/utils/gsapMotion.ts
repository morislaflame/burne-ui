/**
 * GSAP setup and shared motion helpers for Burne UI.
 *
 * Kit motion is event/state-driven (`killMotion` + `useEffect`/`useLayoutEffect`),
 * not `@gsap/react` / `useGSAP`. Packaging (external vs bundled GSAP) is still open —
 * see SETUP.md «GSAP» and CODE_REVIEW §8.
 */

import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

import { getMotionConfig } from "./motionConfig";

gsap.registerPlugin(CustomEase);

const RIPPLE_EASE_ID = "brn-ripple";

let cachedRippleCss = "";

/** Ensures CustomEase for ripple is registered from current motion config. */
export function ensureRippleEase(): string {
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

/**
 * Dynamic compositor hint for transform tweens.
 * Prefer over permanent Tailwind `will-change-transform` (avoids idle layer promotion).
 */
export function setWillChangeTransform(el: HTMLElement, active: boolean): void {
  el.style.willChange = active ? "transform" : "";
}

function clearWillChangeTransformDeep(target: unknown): void {
  if (target instanceof HTMLElement) {
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
