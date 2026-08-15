import { isMotionFeatureEnabledFor } from "@/components/core/utils/motionConfig";
import { animateChevronRotation } from "@/components/core/utils/useChevronRotation";

import type { MotionAnimation, MotionContext } from "../slotMotionTypes";

export function chevronRotateRecipe(ctx: MotionContext): MotionAnimation | undefined {
  const open = ctx.phase === "enter";
  const reduced = ctx.reduced || !isMotionFeatureEnabledFor(ctx.config, "enableExpandable");
  const duration = ctx.params.duration;
  const ease = ctx.params.ease;
  return animateChevronRotation(ctx.el, open, {
    reduced,
    duration,
    ease,
    config: ctx.config,
  }) as MotionAnimation | undefined;
}
