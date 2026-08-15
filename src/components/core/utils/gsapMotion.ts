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
import { parseRippleEaseCss } from "./motionConfigValidation";

const easeByCss = new Map<string, string>();
let rippleEaseSeq = 0;
let customEaseRegistered = false;

function ensureCustomEasePlugin(): void {
  if (customEaseRegistered) return;
  gsap.registerPlugin(CustomEase);
  customEaseRegistered = true;
}

/** Ensures CustomEase for ripple is registered. Optional `css` for scoped config. */
export function ensureRippleEase(css?: string): string {
  ensureCustomEasePlugin();
  const resolved = css ?? getMotionConfig().rippleEaseCss;
  const cached = easeByCss.get(resolved);
  if (cached) return cached;
  const points = parseRippleEaseCss(resolved);
  if (!points && process.env.NODE_ENV !== "production") {
    console.warn(
      `[burne-ui] rippleEaseCss=${JSON.stringify(resolved)} is not cubic-bezier(...); using default`,
    );
  }
  const id = `brn-ripple-${rippleEaseSeq++}`;
  CustomEase.create(
    id,
    points ? `${points[0]},${points[1]},${points[2]},${points[3]}` : "0.25,0.55,0.35,0.95",
  );
  easeByCss.set(resolved, id);
  return id;
}

/**
 * Dynamic compositor hint for transform tweens.
 * Prefer over permanent Tailwind `will-change-transform` (avoids idle layer promotion).
 * Do not use for short interactive scale/x tweens (hover-lift, press-squeeze, Switch thumb) —
 * with fractional control sizes, promoting a layer causes a visible 1px snap. Those paths use
 * GSAP `force3D: false` instead.
 *
 * Accepts HTMLElement, SVGElement, and test doubles with a `style.willChange` field.
 */
export type MotionStyleTarget = {
  style: {
    willChange: string;
  };
};

export function setWillChangeTransform(el: MotionStyleTarget, active: boolean): void {
  el.style.willChange = active ? "transform" : "";
}

/** Set the hint and clear it when the MotionRun settles or is cancelled. */
export function armWillChangeTransform(
  el: MotionStyleTarget,
  onCleanup: (fn: () => void) => void,
): void {
  setWillChangeTransform(el, true);
  onCleanup(() => setWillChangeTransform(el, false));
}

function isMotionStyleTarget(value: unknown): value is MotionStyleTarget {
  if (!value || typeof value !== "object") return false;
  const style = (value as { style?: unknown }).style;
  return Boolean(style && typeof style === "object" && "willChange" in style);
}

/**
 * Flatten GSAP tween targets (Element, SVG, NodeList, selector, nested arrays, tween.targets())
 * so `will-change` cleanup is not limited to `instanceof HTMLElement`.
 */
function collectMotionStyleTargets(targets: readonly unknown[]): MotionStyleTarget[] {
  const out: MotionStyleTarget[] = [];
  const seen = new Set<object>();

  const visit = (value: unknown): void => {
    if (value == null) return;
    if (typeof value === "string") {
      if (typeof document === "undefined") return;
      for (const node of gsap.utils.toArray(value)) visit(node);
      return;
    }
    if (isMotionStyleTarget(value)) {
      if (seen.has(value)) return;
      seen.add(value);
      out.push(value);
      return;
    }
    if (typeof value === "object" && typeof (value as { targets?: () => unknown[] }).targets === "function") {
      try {
        for (const node of (value as { targets: () => unknown[] }).targets()) visit(node);
      } catch {
        /* ignore */
      }
      return;
    }
    let items: unknown[] = [];
    try {
      items = gsap.utils.toArray(value as gsap.TweenTarget);
    } catch {
      return;
    }
    if (items.length === 1 && items[0] === value) return;
    for (const item of items) visit(item);
  };

  for (const target of targets) visit(target);
  return out;
}

function clearWillChangeOnTargets(targets: readonly unknown[]): void {
  for (const node of collectMotionStyleTargets(targets)) {
    setWillChangeTransform(node, false);
  }
}

/**
 * Stops active tweens/timelines on target(s) via `killTweensOf`.
 * Clears inline `will-change` on every stylable target (HTMLElement, SVG, NodeList,
 * nested arrays, selector). Does not clear other inline styles — callers that need
 * a clean slate must reset (`style.transform = ""`, `gsap.set(..., { clearProps })`).
 */
export function killMotion(...targets: gsap.TweenTarget[]): void {
  gsap.killTweensOf(targets);
  clearWillChangeOnTargets(targets);
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
  clearWillChangeOnTargets([target]);
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
 * Wraps a GSAP `onComplete` so `will-change` is cleared when the tween/timeline ends.
 * Call `setWillChangeTransform(el, true)` before starting the animation.
 */
export function clearWillChangeOnComplete(
  el: MotionStyleTarget,
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
