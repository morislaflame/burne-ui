/**
 * Shared interactive motion for 1st-level pressable controls (Button, ToggleButton, CloseButton).
 *
 * Handles:
 * - gloss ref init (createGlossInteractiveRefCallback)
 * - forwarded ref merge
 * - cleanup on !enabled (killMotion + clear --el-shadow)
 * - hover lift / gloss lift on enter / leave  (guarded by `enabled` + motion config / reduced motion)
 * - press squeeze + restore hover on pointer down / Enter / Space
 *   (guarded by `enabled` + motion config / reduced motion)
 *
 * What stays in the component animations file:
 * - async crossfade layers (Button)
 * - expand ripples (Button)
 * - fill animation (ToggleButton)
 */

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import type { ForwardedRef, KeyboardEvent, PointerEvent } from "react";

import { gsap, killMotion } from "./gsapMotion";
import { animateGlossInteractiveHoverLift, animateGlossInteractivePressSqueeze, createGlossInteractiveRefCallback } from "./glossInteractiveMotion";
import {
  animateInteractiveHoverLift,
  animateInteractivePressSqueeze,
  initElementShadow,
  isInteractivePressKey,
  shadowNone,
  shouldSkipInteractiveHoverLift,
} from "./hoverInteractiveLift";
import { prefersReducedMotion } from "./reducedMotion";
import { shadowMotionFor } from "./useShadowMotion";
import { mergeForwardedRef } from "./mergeRefs";

export type UseFirstLevelInteractiveMotionProps = {
  isGloss: boolean;
  /**
   * Whether the element is interactive (true = !disabled / !blocked).
   * Changing to `false` kills all in-flight animations and clears the hover shadow.
   */
  enabled: boolean;
  /**
   * Whether this variant shows a hover shadow (`shadowMotionFor("none")` → `--shadow-lift`).
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
  onKeyDown?: (e: KeyboardEvent<HTMLButtonElement>) => void;
  /**
   * Called at the start of press-squeeze release phase (before restoring hover).
   */
  onPressReleaseStart?: () => void;
};

export function useFirstLevelInteractiveMotion({
  isGloss,
  enabled,
  hasHoverShadow,
  useContentRef = false,
  forwardedRef,
  onPointerEnter: onPointerEnterProp,
  onPointerLeave: onPointerLeaveProp,
  onPointerDown: onPointerDownProp,
  onKeyDown: onKeyDownProp,
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

  const btnShadow = useMemo(
    () => (hasHoverShadow && !isGloss ? shadowMotionFor("none") : undefined),
    [hasHoverShadow, isGloss],
  );

  /**
   * Level 1 idle = `--shadow-none` with a concrete GSAP from-value (same as
   * `useSecondLevelShadow` + `initElementShadow` for base). Skip when motion
   * targets the segmented content span (no root shadow tween).
   */
  useLayoutEffect(() => {
    if (!enabled || !btnShadow || useContentRef) return;
    initElementShadow(btnRef.current, shadowNone());
  }, [btnShadow, enabled, useContentRef]);

  useEffect(() => {
    if (enabled) return;
    const el = btnRef.current;
    const content = contentMotionRef.current;
    hoverPointerInsideRef.current = false;
    if (el) {
      killMotion(el);
      el.style.removeProperty("--el-shadow");
      el.style.removeProperty("box-shadow");
      gsap.set(el, { clearProps: "boxShadow,scale,transform" });
    }
    if (content) {
      killMotion(content);
      content.style.transform = "";
    }
  }, [enabled]);

  const runPressSqueeze = useCallback(() => {
    if (prefersReducedMotion()) return;
    const el = motionTarget();
    if (!el) return;

    if (isGloss && !useContentRef) {
      void animateGlossInteractivePressSqueeze(
        el,
        hoverPointerInsideRef,
        undefined,
        onPressReleaseStart,
      );
      return;
    }

    void animateInteractivePressSqueeze(el, {
      pointerInside: hoverPointerInsideRef,
      shadow: useContentRef ? undefined : btnShadow,
      onReleaseStart: onPressReleaseStart,
    });
  }, [btnShadow, isGloss, motionTarget, onPressReleaseStart, useContentRef]);

  const handlePointerEnter = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onPointerEnterProp?.(e);
      if (!enabled || e.defaultPrevented) return;
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
    [btnShadow, enabled, isGloss, motionTarget, onPointerEnterProp, useContentRef],
  );

  const handlePointerLeave = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onPointerLeaveProp?.(e);
      hoverPointerInsideRef.current = false;
      if (!enabled || shouldSkipInteractiveHoverLift()) return;
      const el = motionTarget();
      if (!el) return;
      if (isGloss && !useContentRef) {
        animateGlossInteractiveHoverLift(el, false);
      } else {
        animateInteractiveHoverLift(el, false, undefined, useContentRef ? undefined : btnShadow);
      }
    },
    [btnShadow, enabled, isGloss, motionTarget, onPointerLeaveProp, useContentRef],
  );

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onPointerDownProp?.(e);
      if (!enabled || e.defaultPrevented) return;
      runPressSqueeze();
    },
    [enabled, onPointerDownProp, runPressSqueeze],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      onKeyDownProp?.(e);
      if (!enabled || e.defaultPrevented || !isInteractivePressKey(e)) return;
      runPressSqueeze();
    },
    [enabled, onKeyDownProp, runPressSqueeze],
  );

  return {
    setRefs,
    btnRef,
    contentMotionRef,
    hoverPointerInsideRef,
    handlePointerEnter,
    handlePointerLeave,
    handlePointerDown,
    handleKeyDown,
  };
}
