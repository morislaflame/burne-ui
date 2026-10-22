import { animateInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";
import { shadowMotionFor } from "@/components/core/utils/useShadowMotion";
 
import type { MotionAnimation, MotionContext } from "../slotMotionTypes";

export function hoverLiftFirstLevelRecipe(ctx: MotionContext): MotionAnimation | undefined {
  const lifted = ctx.phase === "hoverIn";
  const shadow = ctx.params.hasHoverShadow
    ? (ctx.params.shadow ?? shadowMotionFor("none"))
    : undefined;
  return animateInteractiveHoverLift(
    ctx.el,
    lifted,
    ctx.params.liftScale,
    shadow,
    ctx.config,
    ctx.reduced,
  ) as MotionAnimation | undefined;
}
 