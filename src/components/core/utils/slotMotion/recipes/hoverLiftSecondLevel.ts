import {
  animateInteractiveHoverLift,
  type HoverShadowConfig,
} from "@/components/core/utils/hoverInteractiveLift";
import { shadowMotionFor } from "@/components/core/utils/useShadowMotion";
import type { ShadowSize } from "@/tokens/shadows";

import type { MotionContext } from "../slotMotionTypes";

export function hoverLiftSecondLevelRecipe(ctx: MotionContext): void {
  const lifted = ctx.phase === "hoverIn";
  const shadowSize = (ctx.params.shadowSize as ShadowSize | undefined) ?? "base";
  const liftScale = ctx.params.liftScale as number | undefined;
  const shadow = (ctx.params.shadow as HoverShadowConfig | undefined) ?? shadowMotionFor(shadowSize);
  animateInteractiveHoverLift(ctx.el, lifted, liftScale, shadow);
}
