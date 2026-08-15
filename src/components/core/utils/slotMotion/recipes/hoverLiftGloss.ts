import { animateGlossInteractiveHoverLift } from "@/components/core/utils/glossInteractiveMotion";

import type { MotionContext } from "../slotMotionTypes";

export function hoverLiftGlossRecipe(ctx: MotionContext): void {
  const lifted = ctx.phase === "hoverIn";
  animateGlossInteractiveHoverLift(ctx.el, lifted, ctx.params.liftScale, ctx.config);
}
