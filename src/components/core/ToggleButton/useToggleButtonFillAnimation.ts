import { useCallback, useLayoutEffect, useRef, type RefObject } from "react";

import { prefersReducedInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";
import { gsap, killMotion } from "@/components/core/utils/gsapMotion";
import { motionSelectionFillIn, motionSelectionFillOut, getMotionConfig } from "@/components/core/utils/motionConfig";

/**
 * Заливка ToggleButton / CalendarInteractiveCell.
 * Не задавайте `style={{ transform, opacity }}` на fill — React перезапишет GSAP при ререндере родителя.
 */
export function animateToggleButtonFill(
  fill: HTMLElement,
  pressed: boolean,
  reduceMotion = prefersReducedInteractiveHoverLift() || !getMotionConfig().enableToggleButtonFill,
): void {
  killMotion(fill);
  if (reduceMotion) {
    gsap.set(fill, { scale: pressed ? 1 : 0, autoAlpha: pressed ? 1 : 0 });
    return;
  }

  if (pressed) {
    gsap.fromTo(
      fill,
      { scale: 0, autoAlpha: 0 },
      { scale: 1, autoAlpha: 1, ...motionSelectionFillIn(), overwrite: "auto" },
    );
  } else {
    gsap.to(fill, { scale: 0, autoAlpha: 0, ...motionSelectionFillOut(), overwrite: "auto" });
  }
}

export function useToggleButtonFillAnimation(
  pressed: boolean,
  fillRef: RefObject<HTMLElement | null>,
) {
  const prevPressedRef = useRef<boolean | undefined>(undefined);
  const reduceMotion = prefersReducedInteractiveHoverLift();

  const animateTo = useCallback(
    (next: boolean) => {
      const fill = fillRef.current;
      if (!fill) return;
      if (prevPressedRef.current === next) return;
      prevPressedRef.current = next;
      animateToggleButtonFill(fill, next, reduceMotion);
    },
    [fillRef, reduceMotion],
  );

  useLayoutEffect(() => {
    const fill = fillRef.current;
    if (!fill) return;

    if (prevPressedRef.current === undefined) {
      prevPressedRef.current = pressed;
      killMotion(fill);
      gsap.set(fill, { scale: pressed ? 1 : 0, autoAlpha: pressed ? 1 : 0 });
      return;
    }

    if (prevPressedRef.current === pressed) return;
    prevPressedRef.current = pressed;
    animateToggleButtonFill(fill, pressed, reduceMotion);
  }, [pressed, fillRef, reduceMotion]);

  return { animateTo };
}
