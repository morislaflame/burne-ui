import { gsap, killMotionGeometry } from "@/components/core/utils/gsapMotion";
import { motionLoadingDotsFor } from "@/components/core/utils/motionConfig";

import type { MotionAnimation, MotionContext } from "../slotMotionTypes";

export function applyLoadingDotInstant(dot: HTMLElement): void {
  killMotionGeometry(dot);
  gsap.set(dot, { y: 0, scale: 1, transformOrigin: "50% 100%", force3D: false });
}

/**
 * One dot of the loading wave. The host replays `enter` when config or reduced motion changes.
 * Cycle — `repeat: -1`. Index comes from `data-loading-dot`.
 */
export function loadingDotsRecipe(ctx: MotionContext): MotionAnimation | undefined {
  const timing = motionLoadingDotsFor(ctx.config);
  if (ctx.reduced || !timing.enabled) {
    applyLoadingDotInstant(ctx.el);
    return undefined;
  }

  const layout = ctx.params.loadingDot ?? { jumpPx: 7, scalePeak: 1.3 };
  const index = Number(ctx.el.dataset.loadingDot) || 0;
  killMotionGeometry(ctx.el);
  gsap.set(ctx.el, { y: 0, scale: 1, transformOrigin: "50% 100%", force3D: false });

  return gsap.to(ctx.el, {
    keyframes: [
      { y: -layout.jumpPx, scale: layout.scalePeak, duration: timing.halfCycleSec, ease: timing.easeUp },
      { y: 0, scale: 1, duration: timing.halfCycleSec, ease: timing.easeDown },
    ],
    repeat: -1,
    delay: timing.staggerSec * index,
    transformOrigin: "50% 100%",
    overwrite: "auto",
    force3D: false,
  }) as unknown as MotionAnimation;
}
