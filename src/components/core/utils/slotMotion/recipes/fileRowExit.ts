import { gsap } from "@/components/core/utils/gsapMotion";
import { isMotionEnabled, motionInteractive } from "@/components/core/utils/motionConfig";

import type { MotionAnimation, MotionContext } from "../slotMotionTypes";

export function applyFileRowExitInstant(el: HTMLElement, hidden: boolean): void {
  if (hidden) {
    gsap.set(el, { scale: 0.94, y: "-0.5rem", autoAlpha: 0, force3D: false });
    return;
  }
  gsap.set(el, { scale: 1, y: 0, autoAlpha: 1, force3D: false });
}

/** File chip leave: scale + y + autoAlpha. `leave` hides; other phases restore. */
export function fileRowExitRecipe(ctx: MotionContext): MotionAnimation | undefined {
  const hidden = ctx.phase === "leave";
  if (ctx.reduced || !isMotionEnabled()) {
    applyFileRowExitInstant(ctx.el, hidden);
    return undefined;
  }
  if (!hidden) {
    return gsap.to(ctx.el, {
      scale: 1,
      y: 0,
      autoAlpha: 1,
      ...motionInteractive(),
      overwrite: "auto",
      force3D: false,
    }) as unknown as MotionAnimation;
  }
  return gsap.to(ctx.el, {
    scale: 0.94,
    y: "-0.5rem",
    autoAlpha: 0,
    ...motionInteractive(),
    overwrite: "auto",
    force3D: false,
  }) as unknown as MotionAnimation;
}
