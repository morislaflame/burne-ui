import { gsap } from "@/components/core/utils/gsapMotion";
import { isMotionFeatureEnabled, motionContentFade } from "@/components/core/utils/motionConfig";

import type { MotionAnimation, MotionContext } from "../slotMotionTypes";

export function applyContentFadeInstant(el: HTMLElement, visible: boolean): void {
  gsap.set(el, { autoAlpha: visible ? 1 : 0 });
}

/** Fade `autoAlpha` 0 ↔ 1. `enter` shows, `leave` hides. */
export function contentFadeRecipe(ctx: MotionContext): MotionAnimation | undefined {
  const visible = ctx.phase === "enter";
  if (ctx.reduced || !isMotionFeatureEnabled("enableContentFade")) {
    applyContentFadeInstant(ctx.el, visible);
    return undefined;
  }
  return gsap.to(ctx.el, {
    autoAlpha: visible ? 1 : 0,
    ...motionContentFade(),
    overwrite: "auto",
    force3D: false,
  }) as unknown as MotionAnimation;
}
