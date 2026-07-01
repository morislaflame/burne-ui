import { useCallback, useEffect, useRef, type PointerEvent, type RefObject } from "react";

import { killMotion } from "./gsapMotion";
import {
  animateInteractiveHoverLift,
  animateInteractivePressSqueeze,
  prefersReducedInteractiveHoverLift,
  shouldSkipInteractiveHoverLift,
} from "./hoverInteractiveLift";
import { getMotionConfig } from "./motionConfig";

export type UsePressableElementTextMotionProps<
  EventTarget extends HTMLElement = HTMLElement,
  RefTarget extends HTMLElement = HTMLElement,
> = {
  /**
   * Whether the element is disabled. When `true`, animations are skipped and
   * any in-flight animation is killed.
   */
  isDisabled: boolean;
  /**
   * Whether motion is currently enabled (e.g. element is interactive).
   * Changing to `false` kills the in-flight animation and clears the transform.
   */
  enabled: boolean;
  /**
   * Ref to the element that receives the squeeze/lift transform.
   */
  textMotionRef: RefObject<RefTarget | null>;
  /**
   * When `true`, adds a hover-lift animation on pointer enter/leave
   * and restores lift after the press squeeze completes.
   * Default: `false` (press-only).
   */
  hoverLift?: boolean;
  onPointerEnter?: (e: PointerEvent<EventTarget>) => void;
  onPointerLeave?: (e: PointerEvent<EventTarget>) => void;
  onPointerDown?: (e: PointerEvent<EventTarget>) => void;
};

/**
 * Press squeeze (+ optional hover lift) for text-based interactive elements.
 *
 * - `hoverLift: false` (default) — only squeezes on press. Used by Checkbox, Radio, Switch, ListBox.
 * - `hoverLift: true` — lifts on hover and squeezes on press, then restores lift. Used by Link, Tabs.
 */
export function usePressableElementTextMotion<
  EventTarget extends HTMLElement = HTMLElement,
  RefTarget extends HTMLElement = HTMLElement,
>({
  isDisabled,
  enabled,
  textMotionRef,
  hoverLift = false,
  onPointerEnter,
  onPointerLeave,
  onPointerDown,
}: UsePressableElementTextMotionProps<EventTarget, RefTarget>) {
  const reduceMotion = prefersReducedInteractiveHoverLift();
  const hoverInsideRef = useRef(false);

  useEffect(() => {
    const el = textMotionRef.current;
    return () => {
      if (el) killMotion(el);
    };
    // intentionally captures the element at mount time for cleanup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = textMotionRef.current;
    if (!el || !isDisabled) return;
    hoverInsideRef.current = false;
    killMotion(el);
    el.style.transform = "";
  }, [isDisabled, textMotionRef]);

  const handlePointerEnter = useCallback(
    (e: PointerEvent<EventTarget>) => {
      onPointerEnter?.(e);
      if (!hoverLift || !enabled || isDisabled || e.defaultPrevented) return;
      if (shouldSkipInteractiveHoverLift()) return;
      hoverInsideRef.current = true;
      const el = textMotionRef.current;
      if (!el) return;
      animateInteractiveHoverLift(el, true, getMotionConfig().hoverLiftScale);
    },
    [enabled, hoverLift, isDisabled, onPointerEnter, textMotionRef],
  );

  const handlePointerLeave = useCallback(
    (e: PointerEvent<EventTarget>) => {
      onPointerLeave?.(e);
      if (!hoverLift) return;
      hoverInsideRef.current = false;
      if (shouldSkipInteractiveHoverLift()) return;
      const el = textMotionRef.current;
      if (!el) return;
      animateInteractiveHoverLift(el, false, getMotionConfig().hoverLiftScale);
    },
    [hoverLift, onPointerLeave, textMotionRef],
  );

  const handlePointerDown = useCallback(
    (e: PointerEvent<EventTarget>) => {
      onPointerDown?.(e);
      if (e.defaultPrevented || isDisabled || !enabled) return;
      if (reduceMotion) return;
      const el = textMotionRef.current;
      if (!el) return;
      if (hoverLift) {
        void animateInteractivePressSqueeze(el, {
          pointerInside: hoverInsideRef.current,
          liftScale: getMotionConfig().hoverLiftScale,
        });
      } else {
        void animateInteractivePressSqueeze(el);
      }
    },
    [enabled, hoverLift, isDisabled, onPointerDown, reduceMotion, textMotionRef],
  );

  return { handlePointerEnter, handlePointerLeave, handlePointerDown };
}
