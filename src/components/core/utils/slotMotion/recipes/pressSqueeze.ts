import { animateGlossInteractivePressSqueeze } from "@/components/core/utils/glossInteractiveMotion";
import { animateInteractivePressSqueeze } from "@/components/core/utils/hoverInteractiveLift";
import { shadowMotionFor } from "@/components/core/utils/useShadowMotion";

import type { MotionContext, MotionRecipeParams } from "../slotMotionTypes";

type PointerInside = NonNullable<MotionRecipeParams["pointerInside"]>;

function pointerInsideFrom(ctx: MotionContext): PointerInside {
  return ctx.params.pointerInside ?? false;
}

/** Full press-in + release timeline. Default `pressOut` is `false`. */
export function pressSqueezeRecipe(ctx: MotionContext): Promise<void> | undefined {
  if (ctx.reduced) return undefined;
  const shadow = ctx.params.hasHoverShadow
    ? (ctx.params.shadow ?? shadowMotionFor("none"))
    : undefined;
  return animateInteractivePressSqueeze(ctx.el, {
    pointerInside: pointerInsideFrom(ctx),
    liftScale: ctx.params.liftScale,
    shadow,
    onReleaseStart: ctx.params.onReleaseStart,
    signal: ctx.signal,
    config: ctx.config,
  });
}

export function pressSqueezeGlossRecipe(ctx: MotionContext): Promise<void> | undefined {
  if (ctx.reduced) return undefined;
  return animateGlossInteractivePressSqueeze(
    ctx.el,
    pointerInsideFrom(ctx),
    ctx.params.liftScale,
    ctx.params.onReleaseStart,
    { signal: ctx.signal, config: ctx.config },
  );
}
