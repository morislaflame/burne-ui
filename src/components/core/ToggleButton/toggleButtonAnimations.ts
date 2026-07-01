import { useCallback, useRef, type PointerEvent } from "react";

import { useFirstLevelInteractiveMotion } from "@/components/core/utils/useFirstLevelInteractiveMotion";
import { prefersReducedInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";

import { useToggleButtonFillAnimation } from "./useToggleButtonFillAnimation";
import type { UseToggleButtonAnimationsProps } from "./toggleButtonTypes";

/**
 * Interactive motion + fill: заливка стартует в начале release-фазы squeeze.
 */
export function useToggleButtonAnimations({
  animated,
  disabled,
  variant,
  groupSegment,
  forwardedRef,
  pressed,
  onFillStart,
  onPointerEnter,
  onPointerLeave,
  onPointerDown,
}: UseToggleButtonAnimationsProps) {
  const fillRef = useRef<HTMLSpanElement>(null);
  const deferFillFromPressRef = useRef(false);
  const pendingFillRef = useRef<boolean | null>(null);
  const pressReleaseStartedRef = useRef(false);

  const { animateTo, bindFillRef } = useToggleButtonFillAnimation(pressed, fillRef, {
    deferFillFromPressRef,
    onFillStart,
  });

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

  const shouldCoordinateFill =
    animated && !disabled && !prefersReducedInteractiveHoverLift();

  const motion = useFirstLevelInteractiveMotion({
    isGloss: variant === "gloss",
    animated,
    enabled: !disabled,
    hasHoverShadow: variant !== "gloss",
    useContentRef: !!groupSegment,
    forwardedRef,
    onPointerEnter,
    onPointerLeave,
    onPointerDown,
    onPressReleaseStart: shouldCoordinateFill ? onPressReleaseStart : undefined,
  });

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      if (shouldCoordinateFill) {
        deferFillFromPressRef.current = true;
        pressReleaseStartedRef.current = false;
        pendingFillRef.current = !pressed;
      }
      motion.handlePointerDown(e);
    },
    [motion, pressed, shouldCoordinateFill],
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
    bindFillRef,
    queueFillOnClick,
  };
}
