import {
  gsap,
  killMotionGeometry,
} from "@/components/core/utils/gsapMotion";
import {
  isMotionFeatureEnabledFor,
  motionProgressFillFor,
  motionProgressIndeterminateFor,
} from "@/components/core/utils/motionConfig";
 
import { horizontalScaleOrigin, isRtlElement } from "@/components/core/utils/readingDirection";

import type { MotionAnimation, MotionContext, MotionTransformVars } from "../slotMotionTypes";
 
export function clampProgressScale(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}
 
export function progressScaleFromPercent(percent: number): number {
  return clampProgressScale(percent / 100);
}
 
function scaleOf(ctx: MotionContext): number {
  const getter = ctx.params.getProgressScale;
  if (getter) {
    const value = getter();
    return clampProgressScale(Number.isFinite(value) ? value : 0);
  }
  return 0;
}
 
function isHorizontalOf(ctx: MotionContext): boolean {
  return ctx.params.isHorizontal !== false;
}
 
export function progressFillScaleVars(
  scale: number,
  isHorizontal: boolean,
): MotionTransformVars {
  return isHorizontal
    ? { scaleX: scale, scaleY: 1, x: 0, y: 0 }
    : { scaleX: 1, scaleY: scale, x: 0, y: 0 };
}
 
export function applyProgressFillInstant(
  el: HTMLElement,
  scale: number,
  isHorizontal: boolean,
): void {
  killMotionGeometry(el);
  gsap.set(el, {
    ...progressFillScaleVars(scale, isHorizontal),
    transformOrigin: isHorizontal ? horizontalScaleOrigin(el) : "bottom center",
    force3D: false,
  });
}
 
/** Determinate Meter / ProgressBar fill: compositor `scaleX` / `scaleY`. */
export function progressFillRecipe(ctx: MotionContext): MotionAnimation | undefined {
  const isHorizontal = isHorizontalOf(ctx);
  const scale = scaleOf(ctx);
  const origin = isHorizontal ? horizontalScaleOrigin(ctx.el) : "bottom center";
 
  if (ctx.reduced || !isMotionFeatureEnabledFor(ctx.config, "enableProgressFill")) {
    applyProgressFillInstant(ctx.el, scale, isHorizontal);
    return undefined;
  }
 
  killMotionGeometry(ctx.el);
  const timing = motionProgressFillFor(ctx.config);
  const to = {
    ...progressFillScaleVars(scale, isHorizontal),
    transformOrigin: origin,
    ...timing,
    overwrite: "auto" as const,
    force3D: false as const,
  };
 
  if (ctx.phase === "enter") {
    const from = isHorizontal
      ? { scaleX: 0, scaleY: 1, x: 0, y: 0, transformOrigin: origin }
      : { scaleX: 1, scaleY: 0, x: 0, y: 0, transformOrigin: origin };
    return gsap.fromTo(ctx.el, from, to) as unknown as MotionAnimation;
  }
 
  return gsap.to(ctx.el, to) as unknown as MotionAnimation;
}
 
/** ProgressBar indeterminate translate loop. Host replays on ResizeObserver. */
export function progressIndeterminateRecipe(ctx: MotionContext): MotionAnimation | undefined {
  const isHorizontal = isHorizontalOf(ctx);
  const fill = ctx.el;
  const track = fill.parentElement;
 
  if (ctx.reduced || !isMotionFeatureEnabledFor(ctx.config, "enableProgressFill")) {
    killMotionGeometry(fill);
    gsap.set(fill, { clearProps: "transform" });
    return undefined;
  }
 
  if (!track) return undefined;
  const trackSize = isHorizontal ? track.offsetWidth : track.offsetHeight;
  const fillSize = isHorizontal ? fill.offsetWidth : fill.offsetHeight;
  if (
    !Number.isFinite(trackSize) ||
    !Number.isFinite(fillSize) ||
    trackSize <= 0 ||
    fillSize <= 0
  ) {
    return undefined;
  }
 
  killMotionGeometry(fill);
  const timing = motionProgressIndeterminateFor(ctx.config);
  const rtl = isHorizontal && isRtlElement(fill);
  return gsap.fromTo(
    fill,
    isHorizontal ? { x: rtl ? fillSize : -fillSize } : { y: fillSize },
    {
      ...(isHorizontal ? { x: rtl ? -trackSize : trackSize } : { y: -trackSize }),
      ...timing,
      repeat: -1,
      overwrite: "auto",
      force3D: false,
    },
  ) as unknown as MotionAnimation;
}
 