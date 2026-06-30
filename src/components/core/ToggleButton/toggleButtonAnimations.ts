import { useRef } from "react";

import { useFirstLevelInteractiveMotion } from "@/components/core/utils/useFirstLevelInteractiveMotion";

import { useToggleButtonFillAnimation } from "./useToggleButtonFillAnimation";
import type { UseToggleButtonAnimationsProps } from "./toggleButtonTypes";

/**
 * Manages the pressed-state fill animation for ToggleButton.
 * Moved here (Animations layer) from toggleButtonParts to respect the dependency graph:
 * Parts → Animations → use*RootState → Component.tsx
 */
export function useToggleButtonFill(pressed: boolean) {
  const fillRef = useRef<HTMLSpanElement>(null);
  return useToggleButtonFillAnimation(pressed, fillRef);
}

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
  });

  return {
    setRefs: motion.setRefs,
    contentMotionRef: motion.contentMotionRef,
    handlePointerEnter: motion.handlePointerEnter,
    handlePointerLeave: motion.handlePointerLeave,
    handlePointerDown: motion.handlePointerDown,
  };
}
