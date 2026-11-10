import { gsap } from "@/components/core/utils/gsapMotion";
import { isMotionFeatureEnabledFor, motionSelectionFillFor } from "@/components/core/utils/motionConfig";
 
import type { MotionAnimation, MotionContext } from "../slotMotionTypes";
 
/** First-paint and reduced snap. `autoAlpha` also sets `visibility`, which a style write does not. */
export function snapSelectionFill(el: HTMLElement, on: boolean): void {
  gsap.set(el, { scale: on ? 1 : 0, autoAlpha: on ? 1 : 0, force3D: false });
}

export function playSelectionFill(
  el: HTMLElement,
  on: boolean,
  config: Parameters<typeof motionSelectionFillFor>[0],
): MotionAnimation {
  const fillVars = {
    ...motionSelectionFillFor(config),
    overwrite: "auto" as const,
    force3D: false as const,
  };
  if (on) {
    return gsap.fromTo(
      el,
      { scale: 0, autoAlpha: 0 },
      { scale: 1, autoAlpha: 1, ...fillVars },
    ) as unknown as MotionAnimation;
  }
  return gsap.to(el, {
    scale: 0,
    autoAlpha: 0,
    ...fillVars,
  }) as unknown as MotionAnimation;
}
 
export function selectionFillRecipe(ctx: MotionContext): MotionAnimation | undefined {
  const on = ctx.phase === "check";
  if (ctx.reduced || !isMotionFeatureEnabledFor(ctx.config, "enableSelectionFill")) {
    snapSelectionFill(ctx.el, on);
    return undefined;
  }
 
  return playSelectionFill(ctx.el, on, ctx.config);
}
 