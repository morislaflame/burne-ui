import { gsap } from "@/components/core/utils/gsapMotion";
import { isMotionFeatureEnabledFor, motionSelectionFillFor } from "@/components/core/utils/motionConfig";

import type { MotionAnimation, MotionContext } from "../slotMotionTypes";

function applyFillInstant(el: HTMLElement, on: boolean): void {
  el.style.transform = `scale(${on ? 1 : 0})`;
  el.style.opacity = on ? "1" : "0";
}

export function selectionFillRecipe(ctx: MotionContext): MotionAnimation | undefined {
  const on = ctx.phase === "check";
  if (ctx.reduced || !isMotionFeatureEnabledFor(ctx.config, "enableSelectionFill")) {
    applyFillInstant(ctx.el, on);
    return undefined;
  }

  const fillVars = { ...motionSelectionFillFor(ctx.config), overwrite: "auto" as const };
  if (on) {
    return gsap.fromTo(
      ctx.el,
      { scale: 0, autoAlpha: 0 },
      { scale: 1, autoAlpha: 1, ...fillVars },
    ) as unknown as MotionAnimation;
  }
  return gsap.to(ctx.el, {
    scale: 0,
    autoAlpha: 0,
    ...fillVars,
  }) as unknown as MotionAnimation;
}
