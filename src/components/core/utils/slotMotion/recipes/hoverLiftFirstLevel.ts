import { animateInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";
import { shadowMotionFor } from "@/components/core/utils/useShadowMotion";

import type { MotionContext } from "../slotMotionTypes";

export function hoverLiftFirstLevelRecipe(ctx: MotionContext): void {
  const lifted = ctx.phase === "hoverIn";
  const shadow = ctx.params.hasHoverShadow
    ? (ctx.params.shadow ?? shadowMotionFor("none"))
    : undefined;
  animateInteractiveHoverLift(ctx.el, lifted, ctx.params.liftScale, shadow, ctx.config);
}
