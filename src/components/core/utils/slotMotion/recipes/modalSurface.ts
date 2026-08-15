import {
  clearWillChangeOnComplete,
  gsap,
  killMotion,
  setWillChangeTransform,
} from "@/components/core/utils/gsapMotion";
import { motionModal } from "@/components/core/utils/motionConfig";
import { MODAL_PANEL_SCALE_FROM } from "@/components/core/utils/modalSurfaceMotion";

import type { MotionAnimation, MotionContext } from "../slotMotionTypes";

export function applyModalOverlayInstant(el: HTMLElement, open: boolean): void {
  killMotion(el);
  el.style.opacity = open ? "1" : "0";
}

export function applyModalPanelInstant(el: HTMLElement, open: boolean): void {
  killMotion(el);
  if (open) {
    el.style.opacity = "1";
    el.style.visibility = "visible";
    gsap.set(el, { scale: 1, autoAlpha: 1, clearProps: "transform" });
    return;
  }
  gsap.set(el, { autoAlpha: 0, scale: MODAL_PANEL_SCALE_FROM });
}

function modalVars(ctx: MotionContext) {
  const duration =
    typeof ctx.params.duration === "number" ? ctx.params.duration : motionModal().duration;
  const ease = typeof ctx.params.ease === "string" ? ctx.params.ease : motionModal().ease;
  return { duration, ease, overwrite: "auto" as const };
}

export function modalOverlayEnterRecipe(ctx: MotionContext): MotionAnimation | undefined {
  if (ctx.reduced) {
    ctx.el.style.opacity = "1";
    return undefined;
  }
  killMotion(ctx.el);
  return gsap.fromTo(
    ctx.el,
    { opacity: 0 },
    { opacity: 1, ...modalVars(ctx) },
  ) as unknown as MotionAnimation;
}

export function modalOverlayLeaveRecipe(ctx: MotionContext): MotionAnimation | undefined {
  if (ctx.reduced) {
    ctx.el.style.opacity = "0";
    return undefined;
  }
  killMotion(ctx.el);
  return gsap.to(ctx.el, {
    opacity: 0,
    ...modalVars(ctx),
  }) as unknown as MotionAnimation;
}

export function modalPanelEnterRecipe(ctx: MotionContext): MotionAnimation | undefined {
  if (ctx.reduced) {
    ctx.el.style.opacity = "1";
    ctx.el.style.visibility = "visible";
    gsap.set(ctx.el, { scale: 1, clearProps: "transform" });
    return undefined;
  }
  killMotion(ctx.el);
  setWillChangeTransform(ctx.el, true);
  const vars = modalVars(ctx);
  return gsap.fromTo(
    ctx.el,
    { scale: MODAL_PANEL_SCALE_FROM },
    {
      scale: 1,
      ...vars,
      onComplete: clearWillChangeOnComplete(ctx.el),
    },
  ) as unknown as MotionAnimation;
}

export function modalPanelLeaveRecipe(ctx: MotionContext): MotionAnimation | undefined {
  if (ctx.reduced) {
    gsap.set(ctx.el, { autoAlpha: 0, scale: MODAL_PANEL_SCALE_FROM });
    return undefined;
  }
  killMotion(ctx.el);
  setWillChangeTransform(ctx.el, true);
  const vars = modalVars(ctx);
  return gsap.to(ctx.el, {
    autoAlpha: 0,
    scale: MODAL_PANEL_SCALE_FROM,
    ...vars,
    onComplete: clearWillChangeOnComplete(ctx.el),
  }) as unknown as MotionAnimation;
}
