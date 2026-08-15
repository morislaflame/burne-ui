import { gsap } from "@/components/core/utils/gsapMotion";
import { isMotionFeatureEnabled, motionSelectionFill } from "@/components/core/utils/motionConfig";

import type { MotionAnimation, MotionContext } from "../slotMotionTypes";

function applyMarkInstant(el: HTMLElement, on: boolean): void {
  el.style.opacity = on ? "1" : "0";
  el.style.transform = "scale(1)";
}

export function selectionMarkRecipe(ctx: MotionContext): MotionAnimation | undefined {
  const on = ctx.phase === "check";
  if (ctx.reduced || !isMotionFeatureEnabled("enableSelectionFill")) {
    applyMarkInstant(ctx.el, on);
    return undefined;
  }

  const markVars = { ...motionSelectionFill(), overwrite: "auto" as const };
  if (on) {
    return gsap.fromTo(
      ctx.el,
      { scale: 0.88, autoAlpha: 0 },
      { scale: 1, autoAlpha: 1, ...markVars },
    ) as unknown as MotionAnimation;
  }
  return gsap.to(ctx.el, {
    scale: 0.92,
    autoAlpha: 0,
    ...markVars,
  }) as unknown as MotionAnimation;
}
