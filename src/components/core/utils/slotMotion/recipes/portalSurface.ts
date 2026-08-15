import {
  animatePortalClose,
  animatePortalOpen,
  applyReducedPortalMotion,
  isReducedModalMotion,
} from "@/components/core/utils/modalSurfaceMotion";
import { motionTooltip } from "@/components/core/utils/motionConfig";

import type { MotionAnimation, MotionContext } from "../slotMotionTypes";

function portalVars(ctx: MotionContext) {
  const fallback = motionTooltip();
  const duration =
    typeof ctx.params.duration === "number" ? ctx.params.duration : fallback.duration;
  const ease = typeof ctx.params.ease === "string" ? ctx.params.ease : fallback.ease;
  return { duration, ease, overwrite: "auto" as const };
}

export function portalSurfaceEnterRecipe(ctx: MotionContext): MotionAnimation | undefined {
  if (ctx.reduced || isReducedModalMotion()) {
    applyReducedPortalMotion(ctx.el);
    return undefined;
  }
  return animatePortalOpen({
    surface: ctx.el,
    vars: portalVars(ctx),
  }) as unknown as MotionAnimation;
}

export function portalSurfaceLeaveRecipe(ctx: MotionContext): MotionAnimation | undefined {
  if (ctx.reduced || isReducedModalMotion()) {
    applyReducedPortalMotion(ctx.el);
    ctx.complete();
    return undefined;
  }
  return animatePortalClose({
    surface: ctx.el,
    vars: portalVars(ctx),
    onComplete: ctx.complete,
  }) as unknown as MotionAnimation;
}
