import { animateInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";
import { shadowMotionFor } from "@/components/core/utils/useShadowMotion";

import type { MotionContext } from "../slotMotionTypes";

export function hoverLiftSecondLevelRecipe(ctx: MotionContext): void {
  const lifted = ctx.phase === "hoverIn";
  const shadowSize = ctx.params.shadowSize ?? "base";
  const shadow = ctx.params.shadow ?? shadowMotionFor(shadowSize);
  animateInteractiveHoverLift(ctx.el, lifted, ctx.params.liftScale, shadow, ctx.config);
}
