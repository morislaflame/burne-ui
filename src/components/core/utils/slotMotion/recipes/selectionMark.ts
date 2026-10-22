import { gsap } from "@/components/core/utils/gsapMotion";
import { isMotionFeatureEnabledFor, motionSelectionFillFor } from "@/components/core/utils/motionConfig";
 
import type { MotionAnimation, MotionContext } from "../slotMotionTypes";
 
export function snapSelectionMark(el: HTMLElement, on: boolean): void {
  gsap.set(el, { autoAlpha: on ? 1 : 0, scale: 1, force3D: false });
}

export function playSelectionMark(
  el: HTMLElement,
  on: boolean,
  config: Parameters<typeof motionSelectionFillFor>[0],
): MotionAnimation {
  const markVars = {
    ...motionSelectionFillFor(config),
    overwrite: "auto" as const,
    force3D: false as const,
  };
  if (on) {
    return gsap.fromTo(
      el,
      { scale: 0.88, autoAlpha: 0 },
      { scale: 1, autoAlpha: 1, ...markVars },
    ) as unknown as MotionAnimation;
  }
  return gsap.to(el, {
    scale: 0.92,
    autoAlpha: 0,
    ...markVars,
  }) as unknown as MotionAnimation;
}
 
export function selectionMarkRecipe(ctx: MotionContext): MotionAnimation | undefined {
  const on = ctx.phase === "check";
  if (ctx.reduced || !isMotionFeatureEnabledFor(ctx.config, "enableSelectionFill")) {
    snapSelectionMark(ctx.el, on);
    return undefined;
  }
 
  return playSelectionMark(ctx.el, on, ctx.config);
}
 