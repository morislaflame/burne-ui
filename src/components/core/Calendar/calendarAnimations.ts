import { useCallback, useRef } from "react";

import { animateInteractiveHoverLift, animateInteractivePressSqueeze, prefersReducedInteractiveHoverLift, shouldSkipInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";

export function useCalendarNavButtonAnimations(disabled = false) {
  const ref = useRef<HTMLButtonElement>(null);
  const hoverInsideRef = useRef(false);

  const handlePointerEnter = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (disabled || e.defaultPrevented) return;
      hoverInsideRef.current = true;
      const el = ref.current;
      if (!el || shouldSkipInteractiveHoverLift()) return;
      animateInteractiveHoverLift(el, true);
    },
    [disabled],
  );

  const handlePointerLeave = useCallback(() => {
    hoverInsideRef.current = false;
    const el = ref.current;
    if (!el || shouldSkipInteractiveHoverLift()) return;
    animateInteractiveHoverLift(el, false);
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (disabled || e.defaultPrevented) return;
      const el = ref.current;
      if (!el || prefersReducedInteractiveHoverLift()) return;
      void animateInteractivePressSqueeze(el, {
        pointerInside: hoverInsideRef.current,
      });
    },
    [disabled],
  );

  return {
    ref,
    handlePointerEnter,
    handlePointerLeave,
    handlePointerDown,
  };
}

export function useCalendarInteractiveCellAnimations(disabled = false) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const hoverInsideRef = useRef(false);

  const handlePointerEnter = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (disabled || e.defaultPrevented) return;
      hoverInsideRef.current = true;
      const el = btnRef.current;
      if (!el || shouldSkipInteractiveHoverLift()) return;
      animateInteractiveHoverLift(el, true);
    },
    [disabled],
  );

  const handlePointerLeave = useCallback(() => {
    hoverInsideRef.current = false;
    const el = btnRef.current;
    if (!el || shouldSkipInteractiveHoverLift()) return;
    animateInteractiveHoverLift(el, false);
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (disabled || e.defaultPrevented) return;
      const el = btnRef.current;
      if (!el || prefersReducedInteractiveHoverLift()) return;
      void animateInteractivePressSqueeze(el, {
        pointerInside: hoverInsideRef.current,
      });
    },
    [disabled],
  );

  return {
    btnRef,
    handlePointerEnter,
    handlePointerLeave,
    handlePointerDown,
  };
}
