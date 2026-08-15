import { isMotionFeatureEnabled } from "@/components/core/utils/motionConfig";
import { animateCollapsibleHeight } from "@/components/core/utils/useCollapsibleHeight";

import type { MotionAnimation, MotionContext } from "../slotMotionTypes";

export function collapsibleHeightRecipe(ctx: MotionContext): MotionAnimation | undefined {
  const inner = ctx.targets.panelInner;
  if (!inner) return undefined;
  const open = ctx.phase === "enter";
  const reduced = ctx.reduced || !isMotionFeatureEnabled("enableExpandable");
  const duration = typeof ctx.params.duration === "number" ? ctx.params.duration : undefined;
  const ease = typeof ctx.params.ease === "string" ? ctx.params.ease : undefined;
  return animateCollapsibleHeight(ctx.el, inner, open, {
    reduced,
    duration,
    ease,
  }) as MotionAnimation | undefined;
}
