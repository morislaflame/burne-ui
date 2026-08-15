import { gsap, killMotion } from "@/components/core/utils/gsapMotion";
import { isMotionFeatureEnabledFor, motionInteractiveFor, motionSwitchThumbFor } from "@/components/core/utils/motionConfig";

import type { MotionAnimation, MotionContext, MotionTransformVars } from "../slotMotionTypes";

function travelOf(ctx: MotionContext): number {
  const getter = ctx.params.getTravelPx;
  if (getter) {
    const value = getter();
    return Number.isFinite(value) ? value : 0;
  }
  return ctx.params.travelPx ?? 0;
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
  if (ctx.reduced || !isMotionFeatureEnabledFor(ctx.config, "enableSwitchThumb")) {
    applySwitchThumbInstant(ctx.el, checked, travelPx);
    return undefined;
  }
  killMotion(ctx.el);
  const vars: MotionTransformVars = {
    x: checked ? travelPx : 0,
    ...motionSwitchThumbFor(ctx.config),
  };
  return gsap.to(ctx.el, {
    ...vars,
    overwrite: "auto",
    force3D: false,
  }) as unknown as MotionAnimation;
}

export function switchFillRecipe(ctx: MotionContext): MotionAnimation | undefined {
  const checked = ctx.phase === "check";
  if (ctx.reduced || !isMotionFeatureEnabledFor(ctx.config, "enableSwitchThumb")) {
    applySwitchFillInstant(ctx.el, checked);
    return undefined;
  }
  killMotion(ctx.el);
  const timing = motionInteractiveFor(ctx.config);
  if (checked) {
    const from: MotionTransformVars = { autoAlpha: 0 };
    const to: MotionTransformVars = { autoAlpha: 1, ...timing };
    return gsap.fromTo(ctx.el, from, { ...to, overwrite: "auto" }) as unknown as MotionAnimation;
  }
  const hide: MotionTransformVars = { autoAlpha: 0, ...timing };
  return gsap.to(ctx.el, { ...hide, overwrite: "auto" }) as unknown as MotionAnimation;
}

function switchIconRecipe(ctx: MotionContext, visibleOnCheck: boolean): MotionAnimation | undefined {
  const visible = ctx.phase === "check" ? visibleOnCheck : !visibleOnCheck;
  if (ctx.reduced || !isMotionFeatureEnabledFor(ctx.config, "enableSwitchThumb")) {
    applySwitchIconInstant(ctx.el, visible);
    return undefined;
  }
  killMotion(ctx.el);
  const vars = { ...motionInteractiveFor(ctx.config), overwrite: "auto" as const, force3D: false as const };
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
