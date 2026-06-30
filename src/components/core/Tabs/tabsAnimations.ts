import { type PointerEvent, type RefObject } from "react";

import { usePressableElementTextMotion } from "@/components/core/utils/usePressableElementTextMotion";

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
  return usePressableElementTextMotion<HTMLButtonElement, HTMLSpanElement>({
    isDisabled: !!isDisabled,
    enabled: !isDisabled && !isSelected,
    textMotionRef: motionRef,
    hoverLift: true,
    onPointerEnter,
    onPointerLeave,
    onPointerDown,
  });
}
