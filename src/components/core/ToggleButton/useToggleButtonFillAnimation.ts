import { animate, remove } from "animejs";
import { useLayoutEffect, useRef, type RefObject } from "react";

import { prefersReducedInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";
import {
  MOTION_INTERACTIVE_EASE,
  MOTION_INTERACTIVE_MS,
} from "@/components/core/utils/motionTokens";

/** Заливка ToggleButton: чуть выходит под `border`, с overshoot по scale — без щелей в углах. */
export function useToggleButtonFillAnimation(
  pressed: boolean,
  fillRef: RefObject<HTMLElement | null>,
) {
  const firstLayoutRef = useRef(true);
  const reduceMotion = prefersReducedInteractiveHoverLift();

  useLayoutEffect(() => {
    const fill = fillRef.current;
    if (!fill) return;

    const applyInstant = (on: boolean) => {
      fill.style.transform = `scale(${on ? 1 : 0})`;
      fill.style.opacity = on ? "1" : "0";
    };

    if (reduceMotion) {
      remove(fill);
      applyInstant(pressed);
      return;
    }

    if (firstLayoutRef.current) {
      firstLayoutRef.current = false;
      remove(fill);
      applyInstant(pressed);
      return;
    }

    remove(fill);
    void animate(fill, {
      scale: pressed ? [0, 1.06, 1] : [1, 0],
      opacity: pressed ? [0, 1, 1] : [1, 0],
      duration: MOTION_INTERACTIVE_MS,
      ease: MOTION_INTERACTIVE_EASE,
    });
  }, [pressed, fillRef, reduceMotion]);
}
