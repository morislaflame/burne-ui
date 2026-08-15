import {
  animatePortalClose,
  animatePortalOpen,
  applyReducedPortalMotion,
  isReducedModalMotion,
  MODAL_PANEL_SCALE_FROM,
} from "@/components/core/utils/modalSurfaceMotion";
import { gsap, killMotion } from "@/components/core/utils/gsapMotion";
import { motionInteractiveFor, motionToastDismissFor } from "@/components/core/utils/motionConfig";

import { isMotionRunActive, type MotionAnimation, type MotionContext } from "../slotMotionTypes";

function slideDirOf(ctx: MotionContext): number {
  return ctx.params.slideDir ?? 24;
}

function toastVars(ctx: MotionContext, kind: "enter" | "leave") {
  const fallback = kind === "leave" ? motionToastDismissFor(ctx.config) : motionInteractiveFor(ctx.config);
  return {
    duration: ctx.params.duration ?? fallback.duration,
    ease: ctx.params.ease ?? fallback.ease,
    overwrite: "auto" as const,
  };
}

export function applyToastRootInstant(el: HTMLElement, open: boolean, slideDir: number): void {
  killMotion(el);
  if (open) {
    applyReducedPortalMotion(el);
    return;
  }
  gsap.set(el, { autoAlpha: 0, y: slideDir, scale: MODAL_PANEL_SCALE_FROM });
}

export function toastSurfaceEnterRecipe(ctx: MotionContext): MotionAnimation | undefined {
  const slideDir = slideDirOf(ctx);
  if (ctx.reduced || isReducedModalMotion(ctx.config)) {
    applyReducedPortalMotion(ctx.el);
    return undefined;
  }
  return animatePortalOpen({
    surface: ctx.el,
    vars: toastVars(ctx, "enter"),
    from: { y: slideDir, scale: MODAL_PANEL_SCALE_FROM },
    to: { y: 0, scale: 1 },
  }) as unknown as MotionAnimation;
}

export function toastSurfaceLeaveRecipe(ctx: MotionContext): MotionAnimation | undefined {
  const slideDir = slideDirOf(ctx);
  if (ctx.reduced || isReducedModalMotion(ctx.config)) {
    applyToastRootInstant(ctx.el, false, slideDir);
    ctx.complete();
    return undefined;
  }
  return animatePortalClose({
    surface: ctx.el,
    vars: toastVars(ctx, "leave"),
    exit: { y: slideDir },
    onComplete: () => {
      if (!isMotionRunActive(ctx)) return;
      ctx.complete();
    },
  }) as unknown as MotionAnimation;
}
