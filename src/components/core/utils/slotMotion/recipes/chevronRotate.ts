import { isMotionFeatureEnabled } from "@/components/core/utils/motionConfig";
import { animateChevronRotation } from "@/components/core/utils/useChevronRotation";

import type { MotionAnimation, MotionContext } from "../slotMotionTypes";

export function chevronRotateRecipe(ctx: MotionContext): MotionAnimation | undefined {
  const open = ctx.phase === "enter";
  const reduced = ctx.reduced || !isMotionFeatureEnabled("enableExpandable");
  const duration = typeof ctx.params.duration === "number" ? ctx.params.duration : undefined;
  const ease = typeof ctx.params.ease === "string" ? ctx.params.ease : undefined;
  return animateChevronRotation(ctx.el, open, {
    reduced,
    duration,
    ease,
  }) as MotionAnimation | undefined;
}
