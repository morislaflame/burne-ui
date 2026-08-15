import { useMemo, type RefObject } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

import { useContainerPointerHoverHandlers } from "@/components/core/utils/useContainerPointerHoverHandlers";

export function useMotionPointerPhases<Element extends HTMLElement = HTMLElement>({
  enabled,
  targetRef,
  onHoverIn,
  onHoverOut,
  skipHover,
  pointerInsideRef,
}: {
  enabled: boolean;
  targetRef: RefObject<HTMLElement | null>;
  onHoverIn?: (el: HTMLElement, e: ReactPointerEvent<Element>) => void;
  onHoverOut?: (el: HTMLElement, e: ReactPointerEvent<Element>) => void;
  skipHover?: () => boolean;
  pointerInsideRef?: RefObject<boolean>;
}): {
  onPointerOver: (e: ReactPointerEvent<Element>) => void;
  onPointerOut: (e: ReactPointerEvent<Element>) => void;
} {
  const handlers = useContainerPointerHoverHandlers<Element>({
    enabled,
    targetRef,
    skipHover,
    pointerInsideRef,
    onEnter: (el, e) => onHoverIn?.(el, e),
    onLeave: (el, e) => onHoverOut?.(el, e),
  });

  return useMemo(
    () => ({
      onPointerOver: handlers.onPointerOver,
      onPointerOut: handlers.onPointerOut,
    }),
    [handlers.onPointerOver, handlers.onPointerOut],
  );
}
