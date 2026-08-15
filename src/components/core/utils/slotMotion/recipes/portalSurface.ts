import {
  animatePortalClose,
  animatePortalOpen,
  applyReducedPortalMotion,
  isReducedModalMotion,
} from "@/components/core/utils/modalSurfaceMotion";
import { motionTooltipFor } from "@/components/core/utils/motionConfig";

import { isMotionRunActive, type MotionAnimation, type MotionContext } from "../slotMotionTypes";

function portalVars(ctx: MotionContext) {
  const fallback = motionTooltipFor(ctx.config);
  return {
    duration: ctx.params.duration ?? fallback.duration,
    ease: ctx.params.ease ?? fallback.ease,
    overwrite: "auto" as const,
  };
}

export function portalSurfaceEnterRecipe(ctx: MotionContext): MotionAnimation | undefined {
  if (ctx.reduced || isReducedModalMotion(ctx.config)) {
    applyReducedPortalMotion(ctx.el);
    return undefined;
  }
  return animatePortalOpen({
    surface: ctx.el,
    vars: portalVars(ctx),
  }) as unknown as MotionAnimation;
}

export function portalSurfaceLeaveRecipe(ctx: MotionContext): MotionAnimation | undefined {
  if (ctx.reduced || isReducedModalMotion(ctx.config)) {
    applyReducedPortalMotion(ctx.el);
    ctx.complete();
    return undefined;
  }
  return animatePortalClose({
    surface: ctx.el,
    vars: portalVars(ctx),
    onComplete: () => {
      if (!isMotionRunActive(ctx)) return;
      ctx.complete();
    },
  }) as unknown as MotionAnimation;
}
