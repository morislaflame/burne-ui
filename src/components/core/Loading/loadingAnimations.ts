import { useLayoutEffect, useSyncExternalStore, type RefObject } from "react";

import { gsap, killMotion } from "@/components/core/utils/gsapMotion";
import { prefersReducedInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";
import {
  getMotionConfigRevision,
  motionLoadingDots,
  subscribeMotionConfig,
} from "@/components/core/utils/motionConfig";

import { LOADING_DOTS_LAYOUT } from "./loadingStyles";
import type { LoadingSize } from "./loadingTypes";

const LOADING_DOTS_COUNT = 3;

function runLoadingDotsWave(
  dots: HTMLElement[],
  size: LoadingSize,
) {
  const { jumpPx, scalePeak } = LOADING_DOTS_LAYOUT[size];
  const { staggerSec, halfCycleSec, easeUp, easeDown, enabled } =
    motionLoadingDots();

  for (const dot of dots) {
    killMotion(dot);
    gsap.set(dot, { y: 0, scale: 1, transformOrigin: "50% 100%" });
  }

  if (!enabled) return [] as ReturnType<typeof gsap.to>[];

  return dots.map((dot, index) =>
    gsap.to(dot, {
      keyframes: [
        { y: -jumpPx, scale: scalePeak, duration: halfCycleSec, ease: easeUp },
        { y: 0, scale: 1, duration: halfCycleSec, ease: easeDown },
      ],
      repeat: -1,
      delay: staggerSec * index,
      transformOrigin: "50% 100%",
    }),
  );
}

export function useLoadingDotsAnimation(
  trackRef: RefObject<HTMLElement | null>,
  size: LoadingSize,
) {
  const motionRevision = useSyncExternalStore(
    subscribeMotionConfig,
    getMotionConfigRevision,
    getMotionConfigRevision,
  );

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const dots = Array.from(
      track.querySelectorAll<HTMLElement>("[data-loading-dot]"),
    ).slice(0, LOADING_DOTS_COUNT);

    if (dots.length === 0) return;

    const reduceMotion = prefersReducedInteractiveHoverLift();
    let tweens: ReturnType<typeof gsap.to>[] = [];

    if (!reduceMotion) {
      tweens = runLoadingDotsWave(dots, size);
    }

    return () => {
      for (const tween of tweens) tween.kill();
      for (const dot of dots) killMotion(dot);
    };
  }, [size, trackRef, motionRevision]);
}
