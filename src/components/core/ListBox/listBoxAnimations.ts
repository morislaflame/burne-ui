import { useCallback, useEffect, useRef, type PointerEvent } from "react";

import { killMotion } from "@/components/core/utils/gsapMotion";
import {
  animateInteractivePressSqueeze,
  prefersReducedInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import { useMergedGlossPanelRef } from "@/components/core/utils/glossInteractiveMotion";

import type { UseListBoxItemAnimationsProps } from "./listBoxTypes";

export function useListBoxRootGlossRef(isGloss: boolean) {
  return useMergedGlossPanelRef(undefined, isGloss);
}

export function useListBoxItemAnimations({
  disabled,
  hasLabel,
  onPointerDown,
}: UseListBoxItemAnimationsProps) {
  const labelMotionRef = useRef<HTMLElement>(null);
  const reduceMotion = prefersReducedInteractiveHoverLift();
  const enableLabelMotion = !disabled && hasLabel;

  useEffect(() => {
    const el = labelMotionRef.current;
    return () => {
      if (el) killMotion(el);
    };
  }, []);

  useEffect(() => {
    const el = labelMotionRef.current;
    if (!el || !disabled) return;
    killMotion(el);
    el.style.transform = "";
  }, [disabled]);

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLButtonElement>) => {
      onPointerDown?.(event);
      if (event.defaultPrevented || !enableLabelMotion) return;
      if (reduceMotion) return;
      const el = labelMotionRef.current;
      if (!el) return;
      void animateInteractivePressSqueeze(el);
    },
    [enableLabelMotion, onPointerDown, reduceMotion],
  );

  return {
    labelMotionRef,
    enableLabelMotion,
    handlePointerDown,
  };
}
