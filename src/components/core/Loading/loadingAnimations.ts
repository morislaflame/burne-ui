/**
 * Slot motion for Loading — look here first.
 *
 * DOM slots: `root`, `spinner`, `dots` (track)
 *
 * Not slots: individual dots — kit-internal wave (`useLoadingDotsAnimation`).
 * Host: root plays optional `enter`. Defaults: empty.
 */
import { useLayoutEffect, useSyncExternalStore, type RefObject } from "react";

import { gsap, killMotionGeometry } from "@/components/core/utils/gsapMotion";
import { usePrefersReducedMotion } from "@/components/core/utils/reducedMotion";
import { getMotionConfigRevision, motionLoadingDots, subscribeMotionConfig } from "@/components/core/utils/motionConfig";

import { LOADING_DOTS_LAYOUT } from "./loadingStyles";
import type { LoadingMotion, LoadingSize } from "./loadingTypes";

const LOADING_DOTS_COUNT = 3;

function runLoadingDotsWave(
  dots: HTMLElement[],
  size: LoadingSize,
) {
  const { jumpPx, scalePeak } = LOADING_DOTS_LAYOUT[size];
  const { staggerSec, halfCycleSec, easeUp, easeDown, enabled } =
    motionLoadingDots();

  for (const dot of dots) {
    killMotionGeometry(dot);
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
  const reduceMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const dots = Array.from(
      track.querySelectorAll<HTMLElement>("[data-loading-dot]"),
    ).slice(0, LOADING_DOTS_COUNT);

    if (dots.length === 0) return;

    let tweens: ReturnType<typeof gsap.to>[] = [];

    if (!reduceMotion) {
      tweens = runLoadingDotsWave(dots, size);
    }

    return () => {
      for (const tween of tweens) tween.kill();
    };
  }, [size, trackRef, motionRevision, reduceMotion]);
}

export function resolveLoadingMotionDefaults(): LoadingMotion {
  return {};
}
