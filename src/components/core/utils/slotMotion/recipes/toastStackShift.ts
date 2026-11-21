import {
  clearWillChangeOnComplete,
  gsap,
  setWillChangeTransform,
} from "@/components/core/utils/gsapMotion";
import {
  isMotionFeatureEnabledFor,
  motionInteractiveFor,
} from "@/components/core/utils/motionConfig";

import type { MotionAnimation, MotionContext } from "../slotMotionTypes";

function stackOf(ctx: MotionContext) {
  return ctx.params.toastStack ?? { peekY: 0, scale: 1, opacity: 1 };
}

export function applyToastStackInstant(
  el: HTMLElement,
  stack: { peekY: number; scale: number; opacity: number },
): void {
  gsap.set(el, {
    y: stack.peekY,
    scale: stack.scale,
    autoAlpha: stack.opacity,
    force3D: false,
  });
}

/**
 * Stack peek. `enter` fades opacity only (new kit toast at the front).
 * `change` tweens y / scale / autoAlpha.
 */
export function toastStackShiftRecipe(ctx: MotionContext): MotionAnimation | undefined {
  const stack = stackOf(ctx);
  if (ctx.reduced || !isMotionFeatureEnabledFor(ctx.config, "enableToastStack")) {
    applyToastStackInstant(ctx.el, stack);
    return undefined;
  }

  if (ctx.phase === "enter") {
    return gsap.fromTo(
      ctx.el,
      { opacity: 0 },
      { opacity: stack.opacity, ...motionInteractiveFor(ctx.config), overwrite: "auto" },
    ) as unknown as MotionAnimation;
  }

  setWillChangeTransform(ctx.el, true);
  return gsap.to(ctx.el, {
    y: stack.peekY,
    scale: stack.scale,
    autoAlpha: stack.opacity,
    ...motionInteractiveFor(ctx.config),
    overwrite: "auto",
    onComplete: clearWillChangeOnComplete(ctx.el),
  }) as unknown as MotionAnimation;
}
