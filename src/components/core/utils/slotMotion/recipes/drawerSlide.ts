import {
  clearWillChangeOnComplete,
  gsap,
  killMotion,
  setWillChangeTransform,
} from "@/components/core/utils/gsapMotion";
import { isMotionFeatureEnabled, motionModal } from "@/components/core/utils/motionConfig";
import {
  getDrawerSlideCloseTo,
  getDrawerSlideOpenFrom,
  getDrawerSlideRest,
  type DrawerSlidePlacement,
} from "@/components/core/utils/drawerSlide";

import type { MotionAnimation, MotionContext } from "../slotMotionTypes";

function placementOf(ctx: MotionContext): DrawerSlidePlacement {
  const value = ctx.params.placement;
  if (value === "left" || value === "right" || value === "top" || value === "bottom") {
    return value;
  }
  return "right";
}

function modalVars(ctx: MotionContext) {
  const duration =
    typeof ctx.params.duration === "number" ? ctx.params.duration : motionModal().duration;
  const ease = typeof ctx.params.ease === "string" ? ctx.params.ease : motionModal().ease;
  return { duration, ease, overwrite: "auto" as const };
}

function reduced(ctx: MotionContext): boolean {
  return ctx.reduced || !isMotionFeatureEnabled("enableModalMotion");
}

export function applyDrawerPanelInstant(
  el: HTMLElement,
  placement: DrawerSlidePlacement,
  open: boolean,
): void {
  killMotion(el);
  gsap.set(el, open ? { ...getDrawerSlideRest(), clearProps: "transform" } : getDrawerSlideCloseTo(el, placement));
}

export function drawerSlideEnterRecipe(ctx: MotionContext): MotionAnimation | undefined {
  const placement = placementOf(ctx);
  if (reduced(ctx)) {
    gsap.set(ctx.el, { ...getDrawerSlideRest(), clearProps: "transform" });
    return undefined;
  }
  killMotion(ctx.el);
  setWillChangeTransform(ctx.el, true);
  const vars = modalVars(ctx);
  return gsap.fromTo(ctx.el, getDrawerSlideOpenFrom(ctx.el, placement), {
    ...getDrawerSlideRest(),
    ...vars,
    onComplete: clearWillChangeOnComplete(ctx.el),
  }) as unknown as MotionAnimation;
}

export function drawerSlideLeaveRecipe(ctx: MotionContext): MotionAnimation | undefined {
  const placement = placementOf(ctx);
  if (reduced(ctx)) {
    gsap.set(ctx.el, getDrawerSlideCloseTo(ctx.el, placement));
    return undefined;
  }
  killMotion(ctx.el);
  setWillChangeTransform(ctx.el, true);
  const vars = modalVars(ctx);
  return gsap.to(ctx.el, {
    ...getDrawerSlideCloseTo(ctx.el, placement),
    ...vars,
    onComplete: clearWillChangeOnComplete(ctx.el),
  }) as unknown as MotionAnimation;
}
