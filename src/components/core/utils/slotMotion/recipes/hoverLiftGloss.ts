import { animateGlossInteractiveHoverLift } from "@/components/core/utils/glossInteractiveMotion";

import type { MotionContext } from "../slotMotionTypes";

export function hoverLiftGlossRecipe(ctx: MotionContext): void {
  const lifted = ctx.phase === "hoverIn";
  const liftScale = ctx.params.liftScale as number | undefined;
  animateGlossInteractiveHoverLift(ctx.el, lifted, liftScale);
}
