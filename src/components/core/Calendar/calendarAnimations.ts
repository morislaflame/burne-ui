import { useRef } from "react";

import { usePressableElementTextMotion } from "@/components/core/utils/usePressableElementTextMotion";

/**
 * Hover lift + press squeeze for Calendar nav buttons and day/month/year cells.
 * Adaptive lift (element size), shared via `usePressableElementTextMotion`
 * (includes `killMotion` cleanup on unmount).
 */
export function useCalendarPressableAnimations(disabled = false) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { handlePointerEnter, handlePointerLeave, handlePointerDown, handleKeyDown } =
    usePressableElementTextMotion<HTMLButtonElement>({
      isDisabled: disabled,
      enabled: !disabled,
      textMotionRef: buttonRef,
      hoverLift: true,
      hoverLiftScale: "adaptive",
    });

  return {
    buttonRef,
    handlePointerEnter,
    handlePointerLeave,
    handlePointerDown,
    handleKeyDown,
  };
}
