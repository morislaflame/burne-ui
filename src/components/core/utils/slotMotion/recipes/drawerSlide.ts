import {
  armWillChangeTransform,
  clearWillChangeOnComplete,
  gsap,
  killMotion,
} from "@/components/core/utils/gsapMotion";
import { isMotionFeatureEnabledFor, motionModalFor } from "@/components/core/utils/motionConfig";
import {
  getDrawerSlideCloseTo,
  getDrawerSlideOpenFrom,
  getDrawerSlideRest,
  type DrawerSlidePlacement,
} from "@/components/core/utils/drawerSlide";

import type { MotionAnimation, MotionContext } from "../slotMotionTypes";

function placementOf(ctx: MotionContext): DrawerSlidePlacement {
  return ctx.params.placement ?? "right";
}

function modalVars(ctx: MotionContext) {
  const fallback = motionModalFor(ctx.config);
  return {
    duration: ctx.params.duration ?? fallback.duration,
    ease: ctx.params.ease ?? fallback.ease,
    overwrite: "auto" as const,
  };
}

function reduced(ctx: MotionContext): boolean {
  return ctx.reduced || !isMotionFeatureEnabledFor(ctx.config, "enableModalMotion");
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
  armWillChangeTransform(ctx.el, ctx.onCleanup);
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
  armWillChangeTransform(ctx.el, ctx.onCleanup);
  const vars = modalVars(ctx);
  return gsap.to(ctx.el, {
    ...getDrawerSlideCloseTo(ctx.el, placement),
    ...vars,
    onComplete: clearWillChangeOnComplete(ctx.el),
  }) as unknown as MotionAnimation;
}
