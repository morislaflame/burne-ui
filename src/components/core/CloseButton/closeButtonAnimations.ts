import { useFirstLevelInteractiveMotion } from "@/components/core/utils/useFirstLevelInteractiveMotion";

import { CLOSE_BUTTON_HAS_HOVER_SHADOW } from "./closeButtonStyles";
import type { UseCloseButtonAnimationsProps } from "./closeButtonTypes";

export function useCloseButtonAnimations({
  variant,
  disabled,
  forwardedRef,
  onPointerDown,
  onPointerEnter,
  onPointerLeave,
}: UseCloseButtonAnimationsProps) {
  const motion = useFirstLevelInteractiveMotion({
    isGloss: variant === "gloss",
    enabled: !disabled,
    hasHoverShadow: CLOSE_BUTTON_HAS_HOVER_SHADOW.has(variant),
    useContentRef: false,
    forwardedRef,
    onPointerEnter,
    onPointerLeave,
    onPointerDown,
  });

  return {
    setRefs: motion.setRefs,
    handlePointerEnter: motion.handlePointerEnter,
    handlePointerLeave: motion.handlePointerLeave,
    handlePointerDown: motion.handlePointerDown,
  };
}
