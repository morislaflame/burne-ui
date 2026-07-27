import { useEffect, useLayoutEffect, useRef } from "react";

import { gsap, killMotion } from "@/components/core/utils/gsapMotion";
import { usePrefersReducedMotion } from "@/components/core/utils/reducedMotion";
import {
  isMotionFeatureEnabled,
  motionProgressFill,
  motionProgressIndeterminate,
} from "@/components/core/utils/motionConfig";

import type { UseProgressBarFillAnimationProps } from "./progressBarTypes";

export function useProgressBarFillAnimation({
  indeterminate,
  fillTargetStyle,
  isHorizontal,
}: UseProgressBarFillAnimationProps) {
  const fillRef = useRef<HTMLSpanElement>(null);
  const firstLayoutRef = useRef(true);
  const reduceMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (indeterminate) return;
    const fill = fillRef.current;
    if (!fill) return;

    const axisProp = isHorizontal ? "width" : "height";
    const axisValue =
      fillTargetStyle[axisProp] != null ? String(fillTargetStyle[axisProp]) : "";

    const applyInstant = () => {
      killMotion(fill);
      fill.style.transform = "";
      if (isHorizontal) {
        fill.style.width = axisValue;
        fill.style.height = "100%";
      } else {
        fill.style.width = "100%";
        fill.style.height = axisValue;
      }
    };

    if (
      reduceMotion ||
      !isMotionFeatureEnabled("enableProgressFill") ||
      firstLayoutRef.current
    ) {
      firstLayoutRef.current = false;
      applyInstant();
      return;
    }

    firstLayoutRef.current = false;
    killMotion(fill);
    fill.style.transform = "";
    void gsap.to(fill, {
      [axisProp]: axisValue,
      ...motionProgressFill(),
      overwrite: "auto",
    });
  }, [
    fillTargetStyle.height,
    fillTargetStyle.width,
    indeterminate,
    isHorizontal,
    reduceMotion,
  ]);

  useLayoutEffect(() => {
    if (!indeterminate) return;
    const fill = fillRef.current;
    const track = fill?.parentElement;
    if (!fill || !track) return;

    killMotion(fill);

    if (reduceMotion || !isMotionFeatureEnabled("enableProgressFill")) {
      gsap.set(fill, { clearProps: "transform" });
      return;
    }

    const runIndeterminateMotion = () => {
      const trackSize = isHorizontal ? track.offsetWidth : track.offsetHeight;
      const fillSize = isHorizontal ? fill.offsetWidth : fill.offsetHeight;
      if (trackSize <= 0 || fillSize <= 0) return;

      killMotion(fill);

      void gsap.fromTo(
        fill,
        isHorizontal ? { x: -fillSize } : { y: fillSize },
        {
          ...(isHorizontal ? { x: trackSize } : { y: -trackSize }),
          ...motionProgressIndeterminate(),
          repeat: -1,
          overwrite: "auto",
        },
      );
    };

    runIndeterminateMotion();

    if (typeof ResizeObserver === "undefined") return;

    const ro = new ResizeObserver(() => runIndeterminateMotion());
    ro.observe(track);
    ro.observe(fill);

    return () => ro.disconnect();
  }, [indeterminate, isHorizontal, reduceMotion]);

  useEffect(() => {
    const fill = fillRef.current;
    return () => {
      if (fill) killMotion(fill);
    };
  }, []);

  return { fillRef, reduceMotion };
}
