import { useCallback, useRef } from "react";

import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import { usePressableElementTextMotion } from "@/components/core/utils/usePressableElementTextMotion";

import type { UseLinkAnimationsProps } from "./linkTypes";

export function useLinkAnimations({
  forwardedRef,
  onPointerEnter,
  onPointerLeave,
  onPointerDown,
}: UseLinkAnimationsProps) {
  const anchorRef = useRef<HTMLAnchorElement | null>(null);

  const setAnchorRef = useCallback(
    (node: HTMLAnchorElement | null) => {
      anchorRef.current = node;
      mergeForwardedRef(forwardedRef, node);
    },
    [forwardedRef],
  );

  const { handlePointerEnter, handlePointerLeave, handlePointerDown } =
    usePressableElementTextMotion<HTMLAnchorElement>({
      isDisabled: false,
      enabled: true,
      textMotionRef: anchorRef,
      hoverLift: true,
      onPointerEnter,
      onPointerLeave,
      onPointerDown,
    });

  return {
    setAnchorRef,
    handlePointerEnter,
    handlePointerLeave,
    handlePointerDown,
  };
}
