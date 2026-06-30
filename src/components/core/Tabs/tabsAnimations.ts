import { useCallback, type PointerEvent, type RefObject } from "react";

import {
  animateInteractiveHoverLift,
  animateInteractivePressSqueeze,
  shouldSkipInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import { getMotionConfig } from "@/components/core/utils/motionConfig";

export function useTabPointerMotion({
  motionRef,
  isDisabled,
  isSelected,
  onPointerEnter,
  onPointerLeave,
  onPointerDown,
}: {
  motionRef: RefObject<HTMLSpanElement | null>;
  isDisabled: boolean | undefined;
  isSelected: boolean;
  onPointerEnter?: (e: PointerEvent<HTMLButtonElement>) => void;
  onPointerLeave?: (e: PointerEvent<HTMLButtonElement>) => void;
  onPointerDown?: (e: PointerEvent<HTMLButtonElement>) => void;
}) {
  const handlePointerEnter = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onPointerEnter?.(e);
      if (e.defaultPrevented || isDisabled || isSelected) return;
      const el = motionRef.current;
      if (!el || shouldSkipInteractiveHoverLift()) return;
      animateInteractiveHoverLift(el, true, getMotionConfig().hoverLiftScale);
    },
    [isDisabled, isSelected, motionRef, onPointerEnter],
  );

  const handlePointerLeave = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onPointerLeave?.(e);
      if (e.defaultPrevented || isSelected) return;
      const el = motionRef.current;
      if (!el) return;
      animateInteractiveHoverLift(el, false, getMotionConfig().hoverLiftScale);
    },
    [isSelected, motionRef, onPointerLeave],
  );

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onPointerDown?.(e);
      if (e.defaultPrevented || isDisabled) return;
      const el = motionRef.current;
      if (!el || shouldSkipInteractiveHoverLift()) return;
      void animateInteractivePressSqueeze(el);
    },
    [isDisabled, motionRef, onPointerDown],
  );

  return { handlePointerEnter, handlePointerLeave, handlePointerDown };
}
