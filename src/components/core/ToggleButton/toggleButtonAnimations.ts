import { useCallback, useRef, type KeyboardEvent, type PointerEvent } from "react";

import { useFirstLevelInteractiveMotion } from "@/components/core/utils/useFirstLevelInteractiveMotion";
import { isInteractivePressKey } from "@/components/core/utils/hoverInteractiveLift";
import { usePrefersReducedMotion } from "@/components/core/utils/reducedMotion";

import { useToggleButtonFillAnimation } from "./useToggleButtonFillAnimation";
import type { UseToggleButtonAnimationsProps } from "./toggleButtonTypes";

/**
 * Interactive motion + fill: fill starts at the beginning of the squeeze release phase,
 * after click has confirmed the next pressed value (on and off share this timing).
 */
export function useToggleButtonAnimations({
  disabled,
  variant,
  groupSegment,
  forwardedRef,
  pressed,
  onFillStart,
  onPointerEnter,
  onPointerLeave,
  onPointerDown,
  onKeyDown,
}: UseToggleButtonAnimationsProps) {
  const fillRef = useRef<HTMLSpanElement>(null);
  const deferFillFromPressRef = useRef(false);
  const pendingFillRef = useRef<boolean | null>(null);
  const pressReleaseStartedRef = useRef(false);

  const { animateTo, bindFillRef, displayPressed } = useToggleButtonFillAnimation(
    pressed,
    fillRef,
    {
      deferFillFromPressRef,
      onFillStart,
    },
  );

  const clearPressFillCoordination = useCallback(() => {
    deferFillFromPressRef.current = false;
    pendingFillRef.current = null;
    pressReleaseStartedRef.current = false;
  }, []);

  const runPendingFill = useCallback(() => {
    const next = pendingFillRef.current;
    if (next === null) return;
    pendingFillRef.current = null;
    deferFillFromPressRef.current = false;
    animateTo(next);
  }, [animateTo]);

  const onPressReleaseStart = useCallback(() => {
    pressReleaseStartedRef.current = true;
    runPendingFill();
  }, [runPendingFill]);

  const reduceMotion = usePrefersReducedMotion();
  const shouldCoordinateFill = !disabled && !reduceMotion;

  const motion = useFirstLevelInteractiveMotion({
    isGloss: variant === "gloss",
    enabled: !disabled,
    hasHoverShadow: variant !== "gloss",
    useContentRef: !!groupSegment,
    forwardedRef,
    onPointerEnter,
    onPointerLeave,
    onPointerDown,
    onKeyDown,
    onPressReleaseStart: shouldCoordinateFill ? onPressReleaseStart : undefined,
  });

  const beginPressFillCoordination = useCallback(() => {
    if (!shouldCoordinateFill) return;
    // Defer until click confirms the next value; do not predict `!pressed` here
    // (single-select re-click would wrongly start an unfill).
    deferFillFromPressRef.current = true;
    pressReleaseStartedRef.current = false;
    pendingFillRef.current = null;
  }, [shouldCoordinateFill]);

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      beginPressFillCoordination();
      motion.handlePointerDown(e);
    },
    [beginPressFillCoordination, motion],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      if (isInteractivePressKey(e) && !e.defaultPrevented) {
        beginPressFillCoordination();
      }
      motion.handleKeyDown(e);
    },
    [beginPressFillCoordination, motion],
  );

  const handlePointerLeave = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      motion.handlePointerLeave(e);
      clearPressFillCoordination();
    },
    [clearPressFillCoordination, motion],
  );

  const queueFillOnClick = useCallback(
    (next: boolean) => {
      if (!shouldCoordinateFill) {
        animateTo(next);
        return;
      }

      pendingFillRef.current = next;

      if (pressReleaseStartedRef.current) {
        runPendingFill();
      }
    },
    [animateTo, runPendingFill, shouldCoordinateFill],
  );

  return {
    setRefs: motion.setRefs,
    contentMotionRef: motion.contentMotionRef,
    handlePointerEnter: motion.handlePointerEnter,
    handlePointerLeave,
    handlePointerDown,
    handleKeyDown,
    bindFillRef,
    queueFillOnClick,
    displayPressed,
  };
}
