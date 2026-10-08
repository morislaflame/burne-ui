import {
  clearWillChangeOnComplete,
  gsap,
  setWillChangeTransform,
} from "@/components/core/utils/gsapMotion";
import {
  isMotionFeatureEnabledFor,
  motionInteractiveFor,
} from "@/components/core/utils/motionConfig";

import type { MotionAnimation, MotionContext } from "../slotMotionTypes";

export function applyTabsIndicatorRest(indicator: HTMLElement): void {
  gsap.set(indicator, {
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    transformOrigin: "0 0",
    force3D: false,
  });
}

/** Compositor FLIP. The host has already written the layout box (`left` / `top` / `width` / `height`). */
export function tabsIndicatorMoveRecipe(ctx: MotionContext): MotionAnimation | undefined {
  if (ctx.reduced || !isMotionFeatureEnabledFor(ctx.config, "enableTabsIndicator")) {
    applyTabsIndicatorRest(ctx.el);
    return undefined;
  }

  const from = ctx.params.tabsIndicator ?? { x: 0, y: 0, scaleX: 1, scaleY: 1 };
  setWillChangeTransform(ctx.el, true);
  return gsap.fromTo(
    ctx.el,
    { x: from.x, y: from.y, scaleX: from.scaleX, scaleY: from.scaleY, transformOrigin: "0 0" },
    {
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      ...motionInteractiveFor(ctx.config),
      overwrite: "auto",
      onComplete: clearWillChangeOnComplete(ctx.el),
    },
  ) as unknown as MotionAnimation;
}
