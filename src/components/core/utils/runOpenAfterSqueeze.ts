import { useRef, type RefObject } from "react";

import { animateInteractivePressSqueeze } from "./hoverInteractiveLift";
import { prefersReducedMotion } from "./reducedMotion";

/**
 * Runs a press-squeeze animation on `triggerRef.current`, then calls `setOpen(true)`.
 *
 * Delay equals the squeeze timeline (`interactiveDuration × pressSqueezeDurationFactor`,
 * see `motionPressSqueezeTotal()`), so open waits for the press feel to finish.
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

  if (prefersReducedMotion()) {
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
