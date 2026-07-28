import { useRef } from "react";

import { usePressableElementTextMotion } from "@/components/core/utils/usePressableElementTextMotion";

export function useBreadcrumbInteractiveMotion() {
  const textRef = useRef<HTMLSpanElement | null>(null);

  const { handlePointerDown, handleKeyDown } = usePressableElementTextMotion<
    HTMLElement,
    HTMLSpanElement
  >({
    isDisabled: false,
    enabled: true,
    textMotionRef: textRef,
  });

  return { textRef, handlePointerDown, handleKeyDown };
}
