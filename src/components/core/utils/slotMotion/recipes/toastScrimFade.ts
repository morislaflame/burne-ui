import { gsap } from "@/components/core/utils/gsapMotion";
import {
  motionInteractiveFor,
  motionToastDismissFor,
} from "@/components/core/utils/motionConfig";

import type { MotionAnimation, MotionContext } from "../slotMotionTypes";

function scrimOf(ctx: MotionContext) {
  const scrim = ctx.params.toastScrim;
  if (scrim) return scrim;
  return { opacity: ctx.phase === "leave" ? 0 : 1, dismiss: ctx.phase === "leave" };
}

export function applyToastScrimInstant(el: HTMLElement, opacity: number): void {
  gsap.set(el, { opacity, overwrite: "auto" });
}

/** Viewport scrim opacity. Last dismiss uses the toast dismiss duration. */
export function toastScrimFadeRecipe(ctx: MotionContext): MotionAnimation | undefined {
  const scrim = scrimOf(ctx);
  if (ctx.reduced) {
    applyToastScrimInstant(ctx.el, scrim.opacity);
    return undefined;
  }

  const timing = scrim.dismiss
    ? motionToastDismissFor(ctx.config)
    : motionInteractiveFor(ctx.config);

  if (scrim.fromZero) {
    return gsap.fromTo(
      ctx.el,
      { opacity: 0 },
      { opacity: scrim.opacity, ...timing, overwrite: "auto" },
    ) as unknown as MotionAnimation;
  }

  return gsap.to(ctx.el, {
    opacity: scrim.opacity,
    ...timing,
    overwrite: "auto",
  }) as unknown as MotionAnimation;
}
