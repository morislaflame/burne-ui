import { animateInteractivePressSqueeze } from "@/components/core/utils/hoverInteractiveLift";
import { shadowMotionFor } from "@/components/core/utils/useShadowMotion";
 
import type { MotionContext, MotionRecipeParams } from "../slotMotionTypes";
 
type PointerInside = NonNullable<MotionRecipeParams["pointerInside"]>;
 
function pointerInsideFrom(ctx: MotionContext): PointerInside {
  return ctx.params.pointerInside ?? false;
}
 
/**
 * Press uses the same shadow family as hover.
 * Second-level hosts pass `shadowSize` (`base` on Card, fields). Without it,
 * a first-level control (`hasHoverShadow`, Button) stays on `--shadow-lift`.
 * Falling back to `none` here rewrote `--shadow-fade-hover` to `--shadow-lift`
 * and release while the pointer stayed inside never returned to the hover size.
 */
function pressShadowFrom(ctx: MotionContext) {
  if (ctx.params.shadow) return ctx.params.shadow;
  if (ctx.params.shadowSize) return shadowMotionFor(ctx.params.shadowSize);
  if (ctx.params.hasHoverShadow) return shadowMotionFor("none");
  return undefined;
}

/** Full press-in + release timeline. Default `pressOut` is `false`. */
export function pressSqueezeRecipe(ctx: MotionContext): Promise<void> | undefined {
  if (ctx.reduced) return undefined;
  const shadow = pressShadowFrom(ctx);
  return animateInteractivePressSqueeze(ctx.el, {
    pointerInside: pointerInsideFrom(ctx),
    restoreHover: ctx.params.restoreHover,
    liftScale: ctx.params.liftScale,
    shadow,
    onReleaseStart: ctx.params.onReleaseStart,
    signal: ctx.signal,
    config: ctx.config,
  });
}
 
 
