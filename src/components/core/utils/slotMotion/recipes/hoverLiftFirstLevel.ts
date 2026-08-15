import {
  animateInteractiveHoverLift,
  type HoverShadowConfig,
} from "@/components/core/utils/hoverInteractiveLift";
import { shadowMotionFor } from "@/components/core/utils/useShadowMotion";

import type { MotionContext } from "../slotMotionTypes";

export function hoverLiftFirstLevelRecipe(ctx: MotionContext): void {
  const lifted = ctx.phase === "hoverIn";
  const liftScale = ctx.params.liftScale as number | undefined;
  const shadow = ctx.params.hasHoverShadow
    ? ((ctx.params.shadow as HoverShadowConfig | undefined) ?? shadowMotionFor("none"))
    : undefined;
  animateInteractiveHoverLift(ctx.el, lifted, liftScale, shadow);
}
