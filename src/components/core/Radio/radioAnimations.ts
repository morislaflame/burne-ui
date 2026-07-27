import { gsap, killMotion } from "@/components/core/utils/gsapMotion";
import { usePrefersReducedMotion } from "@/components/core/utils/reducedMotion";
import { motionInteractive } from "@/components/core/utils/motionConfig";
import { usePressableElementTextMotion } from "@/components/core/utils/usePressableElementTextMotion";
import { useLayoutEffect, useRef } from "react";

import { useRadioFieldContext } from "./radioContext";
import type { UseRadioAnimationsProps } from "./radioTypes";

export function useRadioControlTrackAnimation() {
  const ctx = useRadioFieldContext();
  const trackRef = useRef<HTMLSpanElement>(null);
  const trackFirstLayoutRef = useRef(true);
  const reduceMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (reduceMotion) {
      killMotion(track);
      track.style.opacity = ctx.isDisabled ? "0.48" : "1";
      return;
    }

    if (trackFirstLayoutRef.current) {
      trackFirstLayoutRef.current = false;
      track.style.opacity = ctx.isDisabled ? "0.48" : "1";
      return;
    }

    killMotion(track);
    const from = Number.parseFloat(getComputedStyle(track).opacity);
    const start = Number.isFinite(from) ? from : 1;
    void gsap.fromTo(
      track,
      { autoAlpha: start },
      {
        autoAlpha: ctx.isDisabled ? 0.48 : 1,
        ...motionInteractive(),
        overwrite: "auto",
      },
    );
  }, [ctx.isDisabled, reduceMotion]);

  return trackRef;
}

export function useRadioTextMotion({
  isDisabled,
  enableTextMotion,
  textMotionRef,
  onPointerDown,
}: UseRadioAnimationsProps) {
  return usePressableElementTextMotion<HTMLLabelElement>({
    isDisabled,
    enabled: enableTextMotion,
    textMotionRef,
    onPointerDown,
  });
}
