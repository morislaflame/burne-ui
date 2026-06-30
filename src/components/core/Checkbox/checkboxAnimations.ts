import { gsap, killMotion } from "@/components/core/utils/gsapMotion";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";

import {
  animateInteractivePressSqueeze,
  prefersReducedInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import { motionInteractive } from "@/components/core/utils/motionConfig";

import { useCheckboxFieldContext } from "./checkboxContext";
import type { UseCheckboxAnimationsProps } from "./checkboxTypes";

export function useCheckboxControlTrackAnimation() {
  const ctx = useCheckboxFieldContext();
  const trackRef = useRef<HTMLSpanElement>(null);
  const trackFirstLayoutRef = useRef(true);
  const reduceMotion = prefersReducedInteractiveHoverLift();

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

export function useCheckboxTextMotion({
  isDisabled,
  enableTextMotion,
  textMotionRef,
  onPointerDown,
}: UseCheckboxAnimationsProps) {
  const reduceMotion = prefersReducedInteractiveHoverLift();

  useEffect(() => {
    const el = textMotionRef.current;
    return () => {
      if (el) killMotion(el);
    };
  }, [textMotionRef]);

  useEffect(() => {
    const el = textMotionRef.current;
    if (!el || !isDisabled) return;
    killMotion(el);
    el.style.transform = "";
  }, [isDisabled, textMotionRef]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      onPointerDown?.(e);
      if (e.defaultPrevented || isDisabled || !enableTextMotion) return;
      if (reduceMotion) return;
      const t = textMotionRef.current;
      if (!t) return;
      void animateInteractivePressSqueeze(t);
    },
    [enableTextMotion, isDisabled, onPointerDown, reduceMotion, textMotionRef],
  );

  return { handlePointerDown };
}
