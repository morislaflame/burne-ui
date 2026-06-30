import { useCallback, type PointerEvent } from "react";

import { useInteractiveTextLift } from "@/components/core/utils/useInteractiveTextLift";

import type { UseLinkAnimationsProps } from "./linkTypes";

export function useLinkAnimations({
  forwardedRef,
  onPointerEnter,
  onPointerLeave,
  onPointerDown,
}: UseLinkAnimationsProps) {
  const {
    innerRef,
    handlePointerEnter: liftEnter,
    handlePointerLeave: liftLeave,
    handlePointerDown: liftDown,
  } = useInteractiveTextLift();

  const setMotionRef = useCallback(
    (node: HTMLSpanElement | null) => {
      innerRef.current = node;
    },
    [innerRef],
  );

  const setAnchorRef = useCallback(
    (node: HTMLAnchorElement | null) => {
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [forwardedRef],
  );

  const handlePointerEnter = useCallback(
    (event: PointerEvent<HTMLAnchorElement>) => {
      onPointerEnter?.(event);
      if (event.defaultPrevented) return;
      liftEnter();
    },
    [liftEnter, onPointerEnter],
  );

  const handlePointerLeave = useCallback(
    (event: PointerEvent<HTMLAnchorElement>) => {
      onPointerLeave?.(event);
      if (event.defaultPrevented) return;
      liftLeave();
    },
    [liftLeave, onPointerLeave],
  );

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLAnchorElement>) => {
      onPointerDown?.(event);
      if (event.defaultPrevented) return;
      liftDown();
    },
    [liftDown, onPointerDown],
  );

  return {
    setMotionRef,
    setAnchorRef,
    handlePointerEnter,
    handlePointerLeave,
    handlePointerDown,
  };
}
