import { gsap, killMotion } from "@/components/core/utils/gsapMotion";
import { isMotionFeatureEnabled, motionInteractive, motionSwitchThumb } from "@/components/core/utils/motionConfig";

import type { MotionAnimation, MotionContext } from "../slotMotionTypes";

function travelOf(ctx: MotionContext): number {
  const getter = ctx.params.getTravelPx;
  if (typeof getter === "function") {
    const value = Number(getter());
    return Number.isFinite(value) ? value : 0;
  }
  return typeof ctx.params.travelPx === "number" ? ctx.params.travelPx : 0;
}

export function applySwitchThumbInstant(el: HTMLElement, checked: boolean, travelPx: number): void {
  killMotion(el);
  el.style.transform = `translate(${checked ? travelPx : 0}px, 0)`;
}

export function applySwitchFillInstant(el: HTMLElement, checked: boolean): void {
  killMotion(el);
  el.style.opacity = checked ? "1" : "0";
}

export function applySwitchIconInstant(el: HTMLElement, visible: boolean): void {
  killMotion(el);
  el.style.opacity = visible ? "1" : "0";
  el.style.transform = "scale(1)";
}

export function switchThumbRecipe(ctx: MotionContext): MotionAnimation | undefined {
  const checked = ctx.phase === "check";
  const travelPx = travelOf(ctx);
  if (ctx.reduced || !isMotionFeatureEnabled("enableSwitchThumb")) {
    applySwitchThumbInstant(ctx.el, checked, travelPx);
    return undefined;
  }
  killMotion(ctx.el);
  return gsap.to(ctx.el, {
    x: checked ? travelPx : 0,
    ...motionSwitchThumb(),
    overwrite: "auto",
    force3D: false,
  }) as unknown as MotionAnimation;
}

export function switchFillRecipe(ctx: MotionContext): MotionAnimation | undefined {
  const checked = ctx.phase === "check";
  if (ctx.reduced || !isMotionFeatureEnabled("enableSwitchThumb")) {
    applySwitchFillInstant(ctx.el, checked);
    return undefined;
  }
  killMotion(ctx.el);
  const vars = { ...motionInteractive(), overwrite: "auto" as const };
  if (checked) {
    return gsap.fromTo(
      ctx.el,
      { autoAlpha: 0 },
      { autoAlpha: 1, ...vars },
    ) as unknown as MotionAnimation;
  }
  return gsap.to(ctx.el, { autoAlpha: 0, ...vars }) as unknown as MotionAnimation;
}

function switchIconRecipe(ctx: MotionContext, visibleOnCheck: boolean): MotionAnimation | undefined {
  const visible = ctx.phase === "check" ? visibleOnCheck : !visibleOnCheck;
  if (ctx.reduced || !isMotionFeatureEnabled("enableSwitchThumb")) {
    applySwitchIconInstant(ctx.el, visible);
    return undefined;
  }
  killMotion(ctx.el);
  const vars = { ...motionInteractive(), overwrite: "auto" as const, force3D: false as const };
  if (visible) {
    return gsap.fromTo(
      ctx.el,
      { autoAlpha: 0, scale: 0.88 },
      { autoAlpha: 1, scale: 1, ...vars },
    ) as unknown as MotionAnimation;
  }
  return gsap.to(ctx.el, { autoAlpha: 0, scale: 0.88, ...vars }) as unknown as MotionAnimation;
}

export function switchIconOnRecipe(ctx: MotionContext): MotionAnimation | undefined {
  return switchIconRecipe(ctx, true);
}

export function switchIconOffRecipe(ctx: MotionContext): MotionAnimation | undefined {
  return switchIconRecipe(ctx, false);
}
