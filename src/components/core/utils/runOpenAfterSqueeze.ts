import { useRef, type RefObject } from "react";

import { animateInteractivePressSqueeze, prefersReducedInteractiveHoverLift } from "./hoverInteractiveLift";

/**
 * Runs a press-squeeze animation on `triggerRef.current`, then calls `setOpen(true)`.
 *
 * - Respects `prefers-reduced-motion` (opens immediately when reduced motion is on).
 * - Guards against double-trigger via `openingRef`.
 * - Falls back to immediate open when element is missing.
 *
 * Use `useOpeningRef()` to create the required `openingRef`.
 */
export function runOpenAfterSqueeze({
  triggerRef,
  openingRef,
  setOpen,
}: {
  triggerRef: RefObject<HTMLElement | null>;
  openingRef: RefObject<boolean>;
  setOpen: (open: boolean) => void;
}): void {
  if (openingRef.current) return;

  if (prefersReducedInteractiveHoverLift()) {
    setOpen(true);
    return;
  }

  const el = triggerRef.current;
  if (!el) {
    setOpen(true);
    return;
  }

  openingRef.current = true;
  void animateInteractivePressSqueeze(el).then(() => {
    openingRef.current = false;
    setOpen(true);
  });
}

/** Creates the guard ref used by `runOpenAfterSqueeze`. */
export function useOpeningRef(): RefObject<boolean> {
  return useRef(false);
}
