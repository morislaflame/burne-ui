import { killMotion } from "@/components/core/utils/gsapMotion";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type PointerEvent,
} from "react";

import {
  animateGlossInteractiveHoverLift,
  animateGlossInteractivePressSqueeze,
  createGlossInteractiveRefCallback,
} from "@/components/core/utils/glossInteractiveMotion";
import {
  animateInteractiveHoverLift,
  animateInteractivePressSqueeze,
  prefersReducedInteractiveHoverLift,
  shouldSkipInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import { firstLevelHoverShadow } from "@/components/core/utils/useShadowMotion";

import type { UseToggleButtonAnimationsProps } from "./toggleButtonTypes";

export function useToggleButtonAnimations({
  animated,
  disabled,
  variant,
  groupSegment,
  forwardedRef,
  onPointerEnter,
  onPointerLeave,
  onPointerDown,
}: UseToggleButtonAnimationsProps) {
  const isGloss = variant === "gloss";
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
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [bindGlossRef, forwardedRef],
  );

  useEffect(() => {
    const el = btnRef.current;
    const content = contentMotionRef.current;
    if ((!el && !content) || !disabled) return;
    hoverPointerInsideRef.current = false;
    if (el) killMotion(el);
    if (content) {
      killMotion(content);
      content.style.transform = "";
    }
  }, [disabled]);

  const btnShadow = useMemo(
    () => (isGloss ? undefined : firstLevelHoverShadow()),
    [isGloss],
  );

  const motionTarget = useCallback(() => {
    return groupSegment ? contentMotionRef.current : btnRef.current;
  }, [groupSegment]);

  const handlePointerEnter = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onPointerEnter?.(e);
      if (e.defaultPrevented || disabled || !animated) return;
      if (shouldSkipInteractiveHoverLift()) return;
      const el = motionTarget();
      if (!el) return;
      hoverPointerInsideRef.current = true;
      if (isGloss && !groupSegment) {
        animateGlossInteractiveHoverLift(el, true);
      } else {
        animateInteractiveHoverLift(el, true, undefined, groupSegment ? undefined : btnShadow);
      }
    },
    [animated, btnShadow, disabled, groupSegment, isGloss, motionTarget, onPointerEnter],
  );

  const handlePointerLeave = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onPointerLeave?.(e);
      hoverPointerInsideRef.current = false;
      if (!animated || shouldSkipInteractiveHoverLift()) return;
      const el = motionTarget();
      if (!el || disabled) return;
      if (isGloss && !groupSegment) {
        animateGlossInteractiveHoverLift(el, false);
      } else {
        animateInteractiveHoverLift(el, false, undefined, groupSegment ? undefined : btnShadow);
      }
    },
    [animated, btnShadow, disabled, groupSegment, isGloss, motionTarget, onPointerLeave],
  );

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onPointerDown?.(e);
      if (e.defaultPrevented || disabled || !animated) return;
      if (prefersReducedInteractiveHoverLift()) return;
      const el = motionTarget();
      if (!el) return;
      const squeeze = isGloss && !groupSegment
        ? animateGlossInteractivePressSqueeze(el)
        : animateInteractivePressSqueeze(el);
      void squeeze.then(() => {
        const btn = motionTarget();
        if (!btn || disabled || shouldSkipInteractiveHoverLift()) return;
        if (hoverPointerInsideRef.current) {
          if (isGloss && !groupSegment) {
            animateGlossInteractiveHoverLift(btn, true);
          } else {
            animateInteractiveHoverLift(btn, true, undefined, groupSegment ? undefined : btnShadow);
          }
        }
      });
    },
    [animated, btnShadow, disabled, groupSegment, isGloss, motionTarget, onPointerDown],
  );

  return {
    setRefs,
    contentMotionRef,
    handlePointerEnter,
    handlePointerLeave,
    handlePointerDown,
  };
}
