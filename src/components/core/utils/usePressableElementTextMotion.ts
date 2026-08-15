import { useCallback, useEffect, useRef, type KeyboardEvent, type PointerEvent, type RefObject } from "react";

import { killMotion } from "./gsapMotion";
import {
  animateInteractiveHoverLift,
  animateInteractivePressSqueeze,
  isInteractivePressKey,
  shouldSkipInteractiveHoverLift,
} from "./hoverInteractiveLift";
import { usePrefersReducedMotion } from "./reducedMotion";
import { useMotionConfig } from "./motionConfigContext";

/**
 * Press squeeze (+ optional hover lift) for text-based interactive elements.
 *
 * - `hoverLift: false` (default) — only squeezes on press. Used by Checkbox, Radio, Switch, ListBox.
 * - `hoverLift: true` — lifts on hover and squeezes on press, then restores lift. Used by Link, Tabs.
 * - `hoverLiftScale: "adaptive"` — size-based lift (Calendar cells/nav); default uses `configureMotion().hoverLiftScale`.
 *
 * Press = pointer down **or** Enter / Space (native activation does not fire `pointerdown`).
 */

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
  /**
   * Hover lift amplitude when `hoverLift` is true.
   * - omit / `undefined` — `getMotionConfig().hoverLiftScale`
   * - `"adaptive"` — size-based (same as bare `animateInteractiveHoverLift`)
   * - `number` — explicit scale
   */
  hoverLiftScale?: number | "adaptive";
  onPointerEnter?: (e: PointerEvent<EventTarget>) => void;
  onPointerLeave?: (e: PointerEvent<EventTarget>) => void;
  onPointerDown?: (e: PointerEvent<EventTarget>) => void;
  onKeyDown?: (e: KeyboardEvent<EventTarget>) => void;
};
export function usePressableElementTextMotion<
  EventTarget extends HTMLElement = HTMLElement,
  RefTarget extends HTMLElement = HTMLElement,
>({
  isDisabled,
  enabled,
  textMotionRef,
  hoverLift = false,
  hoverLiftScale,
  onPointerEnter,
  onPointerLeave,
  onPointerDown,
  onKeyDown,
}: UsePressableElementTextMotionProps<EventTarget, RefTarget>) {
  const reduceMotion = usePrefersReducedMotion();
  const config = useMotionConfig();
  const hoverInsideRef = useRef(false);

  const resolveLiftScale = useCallback((): number | undefined => {
    if (hoverLiftScale === "adaptive") return undefined;
    if (typeof hoverLiftScale === "number") return hoverLiftScale;
    return config.hoverLiftScale;
  }, [config.hoverLiftScale, hoverLiftScale]);

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

  const runPressSqueeze = useCallback(() => {
    if (reduceMotion) return;
    const el = textMotionRef.current;
    if (!el) return;
    if (hoverLift) {
      void animateInteractivePressSqueeze(el, {
        pointerInside: hoverInsideRef,
        liftScale: resolveLiftScale(),
        config,
      });
    } else {
      void animateInteractivePressSqueeze(el, { config });
    }
  }, [config, hoverLift, reduceMotion, resolveLiftScale, textMotionRef]);

  const handlePointerEnter = useCallback(
    (e: PointerEvent<EventTarget>) => {
      onPointerEnter?.(e);
      if (!hoverLift || !enabled || isDisabled || e.defaultPrevented) return;
      if (shouldSkipInteractiveHoverLift(config)) return;
      hoverInsideRef.current = true;
      const el = textMotionRef.current;
      if (!el) return;
      animateInteractiveHoverLift(el, true, resolveLiftScale(), undefined, config);
    },
    [config, enabled, hoverLift, isDisabled, onPointerEnter, resolveLiftScale, textMotionRef],
  );

  const handlePointerLeave = useCallback(
    (e: PointerEvent<EventTarget>) => {
      onPointerLeave?.(e);
      if (!hoverLift) return;
      hoverInsideRef.current = false;
      if (shouldSkipInteractiveHoverLift(config)) return;
      const el = textMotionRef.current;
      if (!el) return;
      animateInteractiveHoverLift(el, false, resolveLiftScale(), undefined, config);
    },
    [config, hoverLift, onPointerLeave, resolveLiftScale, textMotionRef],
  );

  const handlePointerDown = useCallback(
    (e: PointerEvent<EventTarget>) => {
      onPointerDown?.(e);
      if (e.defaultPrevented || isDisabled || !enabled) return;
      runPressSqueeze();
    },
    [enabled, isDisabled, onPointerDown, runPressSqueeze],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<EventTarget>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented || isDisabled || !enabled || !isInteractivePressKey(e)) return;
      runPressSqueeze();
    },
    [enabled, isDisabled, onKeyDown, runPressSqueeze],
  );

  return { handlePointerEnter, handlePointerLeave, handlePointerDown, handleKeyDown };
}
