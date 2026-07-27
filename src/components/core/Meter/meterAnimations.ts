import { useEffect, useLayoutEffect, useRef } from "react";

import { gsap, killMotion } from "@/components/core/utils/gsapMotion";
import { usePrefersReducedMotion } from "@/components/core/utils/reducedMotion";
import { motionInteractive } from "@/components/core/utils/motionConfig";

import type { UseMeterFillAnimationProps } from "./meterTypes";

export function useMeterFillAnimation({
  fillTargetStyle,
  isHorizontal,
}: UseMeterFillAnimationProps) {
  const fillRef = useRef<HTMLSpanElement>(null);
  const firstLayoutRef = useRef(true);
  const reduceMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const fill = fillRef.current;
    if (!fill) return;

    if (reduceMotion || firstLayoutRef.current) {
      firstLayoutRef.current = false;
      killMotion(fill);
      fill.style.width =
        fillTargetStyle.width != null ? String(fillTargetStyle.width) : "";
      fill.style.height =
        fillTargetStyle.height != null ? String(fillTargetStyle.height) : "";
      return;
    }

    killMotion(fill);
    void gsap.to(fill, {
      ...(isHorizontal
        ? { width: fillTargetStyle.width }
        : { height: fillTargetStyle.height }),
      ...motionInteractive(),
      overwrite: "auto",
    });
  }, [fillTargetStyle.height, fillTargetStyle.width, isHorizontal, reduceMotion]);

  useEffect(() => {
    const fill = fillRef.current;
    return () => {
      if (fill) killMotion(fill);
    };
  }, []);

  return { fillRef };
}
