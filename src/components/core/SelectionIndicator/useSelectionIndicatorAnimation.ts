import { animate, remove } from "animejs";
import { useLayoutEffect, useRef, type RefObject } from "react";

import { prefersReducedInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";
import {
  MOTION_INTERACTIVE_EASE,
  MOTION_INTERACTIVE_MS,
} from "@/components/core/utils/motionTokens";

export function useSelectionIndicatorAnimation(
  active: boolean,
  fillRef: RefObject<HTMLElement | null>,
  iconRef?: RefObject<HTMLElement | null>,
) {
  const firstLayoutRef = useRef(true);
  const reduceMotion = prefersReducedInteractiveHoverLift();

  useLayoutEffect(() => {
    const fill = fillRef.current;
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
      if (fill) remove(fill);
      if (icon) remove(icon);
      applyInstant(active);
      return;
    }

    if (firstLayoutRef.current) {
      firstLayoutRef.current = false;
      if (fill) remove(fill);
      if (icon) remove(icon);
      applyInstant(active);
      return;
    }

    if (fill) {
      remove(fill);
      void animate(fill, {
        scale: active ? [0, 1] : [1, 0],
        opacity: active ? [0, 1] : [1, 0],
        duration: MOTION_INTERACTIVE_MS,
        ease: MOTION_INTERACTIVE_EASE,
      });
    }

    if (icon) {
      remove(icon);
      void animate(icon, {
        opacity: active ? [0, 1] : [1, 0],
        scale: active ? [0.88, 1] : [1, 0.92],
        duration: MOTION_INTERACTIVE_MS,
        ease: MOTION_INTERACTIVE_EASE,
      });
    }
  }, [active, fillRef, iconRef, reduceMotion]);
}
