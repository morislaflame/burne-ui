/**
 * Shared interactive motion for 1st-level pressable controls (Button, ToggleButton, CloseButton).
 *
 * Handles:
 * - gloss ref init (createGlossInteractiveRefCallback)
 * - forwarded ref merge
 * - cleanup on !enabled (killMotion + clear --el-shadow)
 * - hover lift / gloss lift on enter / leave  (guarded by `animated && enabled`)
 * - press squeeze + restore hover on pointer down  (guarded by `animated && enabled`)
 *
 * What stays in the component animations file:
 * - async crossfade layers (Button)
 * - expand ripples (Button)
 * - fill animation (ToggleButton)
 */

import { useCallback, useEffect, useMemo, useRef } from "react";
import type { ForwardedRef, PointerEvent } from "react";

import { killMotion } from "./gsapMotion";
import {
  animateGlossInteractiveHoverLift,
  animateGlossInteractivePressSqueeze,
  createGlossInteractiveRefCallback,
} from "./glossInteractiveMotion";
import {
  animateInteractiveHoverLift,
  animateInteractivePressSqueeze,
  prefersReducedInteractiveHoverLift,
  shouldSkipInteractiveHoverLift,
} from "./hoverInteractiveLift";
import { firstLevelHoverShadow } from "./useShadowMotion";
import { mergeForwardedRef } from "./mergeRefs";

export type UseFirstLevelInteractiveMotionProps = {
  isGloss: boolean;
  /**
   * When `false`, all GSAP interactions (hover lift, press squeeze) are skipped.
   */
  animated: boolean;
  /**
   * Whether the element is interactive (true = !disabled / !blocked).
   * Changing to `false` kills all in-flight animations and clears the hover shadow.
   */
  enabled: boolean;
  /**
   * Whether this variant shows a hover shadow (`firstLevelHoverShadow`).
   * `false` for ghost/gloss or any variant without hover shadow.
   */
  hasHoverShadow: boolean;
  /**
   * Animate `contentMotionRef` instead of the root button element.
   * Set to `true` when a `groupSegment` is active (ButtonGroup segmented layout).
   */
  useContentRef?: boolean;
  forwardedRef: ForwardedRef<HTMLButtonElement>;
  onPointerEnter?: (e: PointerEvent<HTMLButtonElement>) => void;
  onPointerLeave?: (e: PointerEvent<HTMLButtonElement>) => void;
  onPointerDown?: (e: PointerEvent<HTMLButtonElement>) => void;
  /**
   * Called at the start of press-squeeze release phase (before restoring hover).
   */
  onPressReleaseStart?: () => void;
  /**
   * Optional override for the "still enabled?" check inside the async `afterPress` callback.
   * Useful when `enabled` might change between press and animation completion (e.g. Button async).
   * Default: returns the current `enabled` closure value.
   */
  afterPressEnabled?: () => boolean;
};

export function useFirstLevelInteractiveMotion({
  isGloss,
  animated,
  enabled,
  hasHoverShadow,
  useContentRef = false,
  forwardedRef,
  onPointerEnter: onPointerEnterProp,
  onPointerLeave: onPointerLeaveProp,
  onPointerDown: onPointerDownProp,
  onPressReleaseStart,
}: UseFirstLevelInteractiveMotionProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const contentMotionRef = useRef<HTMLSpanElement>(null);
  const hoverPointerInsideRef = useRef(false);

  const bindGlossRef = useMemo(
    () => createGlossInteractiveRefCallback(btnRef, isGloss),
    [isGloss],
  );

  const setRefs = useCallback(
    (node: HTMLButtonElement | null) => {
      bindGlossRef(node);
      btnRef.current = node;
      mergeForwardedRef(forwardedRef, node);
    },
    [bindGlossRef, forwardedRef],
  );

  const motionTarget = useCallback(
    () => (useContentRef ? contentMotionRef.current : btnRef.current),
    [useContentRef],
  );

  useEffect(() => {
    if (enabled) return;
    const el = btnRef.current;
    const content = contentMotionRef.current;
    hoverPointerInsideRef.current = false;
    if (el) {
      killMotion(el);
      el.style.removeProperty("--el-shadow");
    }
    if (content) {
      killMotion(content);
      content.style.transform = "";
    }
  }, [enabled]);

  const btnShadow = useMemo(
    () => (hasHoverShadow && !isGloss ? firstLevelHoverShadow() : undefined),
    [hasHoverShadow, isGloss],
  );

  const handlePointerEnter = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onPointerEnterProp?.(e);
      if (!animated || !enabled || e.defaultPrevented) return;
      if (shouldSkipInteractiveHoverLift()) return;
      const el = motionTarget();
      if (!el) return;
      hoverPointerInsideRef.current = true;
      if (isGloss && !useContentRef) {
        animateGlossInteractiveHoverLift(el, true);
      } else {
        animateInteractiveHoverLift(el, true, undefined, useContentRef ? undefined : btnShadow);
      }
    },
    [animated, btnShadow, enabled, isGloss, motionTarget, onPointerEnterProp, useContentRef],
  );

  const handlePointerLeave = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onPointerLeaveProp?.(e);
      hoverPointerInsideRef.current = false;
      if (!animated || !enabled || shouldSkipInteractiveHoverLift()) return;
      const el = motionTarget();
      if (!el) return;
      if (isGloss && !useContentRef) {
        animateGlossInteractiveHoverLift(el, false);
      } else {
        animateInteractiveHoverLift(el, false, undefined, useContentRef ? undefined : btnShadow);
      }
    },
    [animated, btnShadow, enabled, isGloss, motionTarget, onPointerLeaveProp, useContentRef],
  );

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onPointerDownProp?.(e);
      if (!animated || !enabled || e.defaultPrevented) return;
      if (prefersReducedInteractiveHoverLift()) return;
      const el = motionTarget();
      if (!el) return;

      if (isGloss && !useContentRef) {
        void animateGlossInteractivePressSqueeze(
          el,
          hoverPointerInsideRef.current,
          undefined,
          onPressReleaseStart,
        );
        return;
      }

      void animateInteractivePressSqueeze(el, {
        pointerInside: hoverPointerInsideRef.current,
        shadow: useContentRef ? undefined : btnShadow,
        onReleaseStart: onPressReleaseStart,
      });
    },
    [animated, btnShadow, enabled, isGloss, motionTarget, onPointerDownProp, onPressReleaseStart, useContentRef],
  );

  return {
    setRefs,
    btnRef,
    contentMotionRef,
    hoverPointerInsideRef,
    handlePointerEnter,
    handlePointerLeave,
    handlePointerDown,
  };
}
