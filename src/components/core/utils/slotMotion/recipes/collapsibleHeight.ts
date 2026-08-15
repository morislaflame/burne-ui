import { isMotionFeatureEnabledFor } from "@/components/core/utils/motionConfig";
import { animateCollapsibleHeight } from "@/components/core/utils/useCollapsibleHeight";

import type { MotionAnimation, MotionContext } from "../slotMotionTypes";

/** Enter/leave panel height. Snapshot `scrollHeight` inside `animateCollapsibleHeight` — not a GSAP function value. */
export function collapsibleHeightRecipe(ctx: MotionContext): MotionAnimation | undefined {
  const inner = ctx.targets.panelInner;
  if (!inner) return undefined;
  const open = ctx.phase === "enter";
  const reduced = ctx.reduced || !isMotionFeatureEnabledFor(ctx.config, "enableExpandable");
  const duration = ctx.params.duration;
  const ease = ctx.params.ease;
  return animateCollapsibleHeight(ctx.el, inner, open, {
    reduced,
    duration,
    ease,
    config: ctx.config,
  }) as MotionAnimation | undefined;
}
