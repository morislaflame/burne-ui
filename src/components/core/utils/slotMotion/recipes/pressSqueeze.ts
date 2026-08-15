import type { RefObject } from "react";

import { animateGlossInteractivePressSqueeze } from "@/components/core/utils/glossInteractiveMotion";
import {
  animateInteractivePressSqueeze,
  type HoverShadowConfig,
} from "@/components/core/utils/hoverInteractiveLift";
import { shadowMotionFor } from "@/components/core/utils/useShadowMotion";

import type { MotionContext } from "../slotMotionTypes";

type PointerInside = boolean | RefObject<boolean | null> | (() => boolean);

function pointerInsideFrom(ctx: MotionContext): PointerInside {
  return (ctx.params.pointerInside as PointerInside | undefined) ?? false;
}

/** Full press-in + release timeline. Default `pressOut` is `false`. */
export function pressSqueezeRecipe(ctx: MotionContext): Promise<void> | undefined {
  if (ctx.reduced) return undefined;
  const shadow = ctx.params.hasHoverShadow
    ? ((ctx.params.shadow as HoverShadowConfig | undefined) ?? shadowMotionFor("none"))
    : undefined;
  return animateInteractivePressSqueeze(ctx.el, {
    pointerInside: pointerInsideFrom(ctx),
    liftScale: ctx.params.liftScale as number | undefined,
    shadow,
    onReleaseStart: ctx.params.onReleaseStart as (() => void) | undefined,
  });
}

export function pressSqueezeGlossRecipe(ctx: MotionContext): Promise<void> | undefined {
  if (ctx.reduced) return undefined;
  return animateGlossInteractivePressSqueeze(
    ctx.el,
    pointerInsideFrom(ctx),
    ctx.params.liftScale as number | undefined,
    ctx.params.onReleaseStart as (() => void) | undefined,
  );
}
