import { useCallback, useRef } from "react";

import {
  animateInteractiveHoverLift,
  animateInteractivePressSqueeze,
  shouldSkipInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import { getMotionConfig } from "@/components/core/utils/motionConfig";

/** Hover-lift и press-squeeze для текстовых интерактивов (крошки, ссылки и т.п.). */
export function useInteractiveTextLift() {
  const innerRef = useRef<HTMLSpanElement | null>(null);
  const liftScale = getMotionConfig().hoverLiftScale;

  const handlePointerEnter = useCallback(() => {
    const el = innerRef.current;
    if (!el || shouldSkipInteractiveHoverLift()) return;
    animateInteractiveHoverLift(el, true, liftScale);
  }, [liftScale]);

  const handlePointerLeave = useCallback(() => {
    const el = innerRef.current;
    if (!el) return;
    animateInteractiveHoverLift(el, false, liftScale);
  }, [liftScale]);

  const handlePointerDown = useCallback(() => {
    const el = innerRef.current;
    if (!el || shouldSkipInteractiveHoverLift()) return;
    void animateInteractivePressSqueeze(el);
  }, []);

  return {
    innerRef,
    handlePointerEnter,
    handlePointerLeave,
    handlePointerDown,
  };
}
