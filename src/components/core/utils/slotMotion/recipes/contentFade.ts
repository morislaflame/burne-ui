import { gsap } from "@/components/core/utils/gsapMotion";
import { isMotionFeatureEnabledFor, motionContentFadeFor } from "@/components/core/utils/motionConfig";

import type { MotionAnimation, MotionContext } from "../slotMotionTypes";

export function applyContentFadeInstant(el: HTMLElement, visible: boolean): void {
  gsap.set(el, { autoAlpha: visible ? 1 : 0 });
}

/** Fade `autoAlpha` 0 ↔ 1. `enter` shows, `leave` hides. */
export function contentFadeRecipe(ctx: MotionContext): MotionAnimation | undefined {
  const visible = ctx.phase === "enter";
  if (ctx.reduced || !isMotionFeatureEnabledFor(ctx.config, "enableContentFade")) {
    applyContentFadeInstant(ctx.el, visible);
    return undefined;
  }
  return gsap.to(ctx.el, {
    autoAlpha: visible ? 1 : 0,
    ...motionContentFadeFor(ctx.config),
    overwrite: "auto",
    force3D: false,
  }) as unknown as MotionAnimation;
}
