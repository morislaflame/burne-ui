import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  type RefObject,
} from "react";

import { prefersReducedInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";
import { gsap, killMotion } from "@/components/core/utils/gsapMotion";
import { motionSelectionFill, getMotionConfig } from "@/components/core/utils/motionConfig";

const TOGGLE_FILL_INIT_ATTR = "data-toggle-fill-init";

/**
 * Fill for ToggleButton / CalendarInteractiveCell.
 * Do not set `style={{ transform, opacity }}` on fill — React will overwrite GSAP on parent re-render.
 */
export function applyToggleButtonFillInstant(fill: HTMLElement, pressed: boolean) {
  killMotion(fill);
  gsap.set(fill, { scale: pressed ? 1 : 0, autoAlpha: pressed ? 1 : 0 });
}

export function createToggleButtonFillRefCallback(
  ref: RefObject<HTMLElement | null>,
  initialPressed: boolean,
) {
  return (node: HTMLElement | null) => {
    ref.current = node;
    if (node && !node.hasAttribute(TOGGLE_FILL_INIT_ATTR)) {
      node.setAttribute(TOGGLE_FILL_INIT_ATTR, "");
      applyToggleButtonFillInstant(node, initialPressed);
    }
  };
}

export function animateToggleButtonFill(
  fill: HTMLElement,
  pressed: boolean,
  reduceMotion = prefersReducedInteractiveHoverLift() || !getMotionConfig().enableToggleButtonFill,
): void {
  killMotion(fill);
  if (reduceMotion) {
    applyToggleButtonFillInstant(fill, pressed);
    return;
  }

  if (pressed) {
    gsap.fromTo(
      fill,
      { scale: 0, autoAlpha: 0 },
      { scale: 1, autoAlpha: 1, ...motionSelectionFill(), overwrite: "auto" },
    );
  } else {
    gsap.to(fill, { scale: 0, autoAlpha: 0, ...motionSelectionFill(), overwrite: "auto" });
  }
}

export function useToggleButtonFillAnimation(
  pressed: boolean,
  fillRef: RefObject<HTMLElement | null>,
) {
  const initialPressedRef = useRef(pressed);
  const prevPressedRef = useRef<boolean | undefined>(undefined);
  const reduceMotion = prefersReducedInteractiveHoverLift();

  const bindFillRef = useMemo(
    () => createToggleButtonFillRefCallback(fillRef, initialPressedRef.current),
    [fillRef],
  );

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
      applyToggleButtonFillInstant(fill, pressed);
      return;
    }

    if (prevPressedRef.current === pressed) return;
    prevPressedRef.current = pressed;
    animateToggleButtonFill(fill, pressed, reduceMotion);
  }, [pressed, fillRef, reduceMotion]);

  return { animateTo, bindFillRef };
}
