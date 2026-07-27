import { useLayoutEffect, useRef, type RefObject } from "react";

import { usePrefersReducedMotion } from "@/components/core/utils/reducedMotion";
import { gsap, killMotion } from "@/components/core/utils/gsapMotion";
import { isMotionFeatureEnabled, motionSelectionFill } from "@/components/core/utils/motionConfig";

export function useSelectionIndicatorAnimation(
  active: boolean,
  fillRef?: RefObject<HTMLElement | null>,
  iconRef?: RefObject<HTMLElement | null>,
) {
  const firstLayoutRef = useRef(true);
  const reduceMotion =
    usePrefersReducedMotion() || !isMotionFeatureEnabled("enableSelectionFill");

  useLayoutEffect(() => {
    const fill = fillRef?.current;
    const icon = iconRef?.current;

    const applyInstant = (on: boolean) => {
      if (fill) {
        fill.style.transform = `scale(${on ? 1 : 0})`;
        fill.style.opacity = on ? "1" : "0";
      }
      if (icon) {
        icon.style.opacity = on ? "1" : "0";
        icon.style.transform = "scale(1)";
      }
    };

    if (!fill && !icon) return;

    if (reduceMotion) {
      if (fill) killMotion(fill);
      if (icon) killMotion(icon);
      applyInstant(active);
      return;
    }

    if (firstLayoutRef.current) {
      firstLayoutRef.current = false;
      if (fill) killMotion(fill);
      if (icon) killMotion(icon);
      applyInstant(active);
      return;
    }

    const fillVars = { ...motionSelectionFill(), overwrite: "auto" as const };
    const markVars = { ...motionSelectionFill(), overwrite: "auto" as const };

    if (fill) {
      killMotion(fill);
      if (active) {
        gsap.fromTo(fill, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, ...fillVars });
      } else {
        gsap.to(fill, { scale: 0, autoAlpha: 0, ...fillVars });
      }
    }

    if (icon) {
      killMotion(icon);
      if (active) {
        gsap.fromTo(icon, { scale: 0.88, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, ...markVars });
      } else {
        gsap.to(icon, { scale: 0.92, autoAlpha: 0, ...markVars });
      }
    }
  }, [active, fillRef, iconRef, reduceMotion]);
}
