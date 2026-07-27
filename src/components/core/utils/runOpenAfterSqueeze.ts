import { useRef, type RefObject } from "react";

import { animateInteractivePressSqueeze } from "./hoverInteractiveLift";
import { prefersReducedMotion } from "./reducedMotion";

export type RunOpenAfterSqueezeOptions = {
  triggerRef: RefObject<HTMLElement | null>;
  openingRef: RefObject<boolean>;
  setOpen: (open: boolean) => void;
  /** Skip when the control is disabled. Re-checked after the squeeze resolves. */
  disabled?: boolean;
  /** Runs after `setOpen(true)` (focus, active option, filter seed, …). */
  onOpened?: () => void;
  /**
   * Press animation before open. Default: standard `animateInteractivePressSqueeze`.
   * Gloss / other surface plugins can inject their own squeeze without forking this helper.
   */
  runSqueeze?: (el: HTMLElement) => Promise<void>;
};

/**
 * Runs a press-squeeze animation on `triggerRef.current`, then calls `setOpen(true)`.
 *
 * Delay equals the squeeze timeline (`interactiveDuration × pressSqueezeDurationFactor`,
 * see `motionPressSqueezeTotal()`), so open waits for the press feel to finish.
 *
 * - Respects `prefers-reduced-motion` (opens immediately when reduced motion is on).
 * - Guards against double-trigger via `openingRef`.
 * - Falls back to immediate open when element is missing.
 * - Variant-agnostic: default squeeze is standard; gloss is not branched here.
 *
 * Use `useOpeningRef()` to create the required `openingRef`.
 */
export function runOpenAfterSqueeze({
  triggerRef,
  openingRef,
  setOpen,
  disabled = false,
  onOpened,
  runSqueeze = (el) => animateInteractivePressSqueeze(el),
}: RunOpenAfterSqueezeOptions): void {
  if (disabled || openingRef.current) return;

  const openNow = () => {
    if (disabled) return;
    setOpen(true);
    onOpened?.();
  };

  if (prefersReducedMotion()) {
    openNow();
    return;
  }

  const el = triggerRef.current;
  if (!el) {
    openNow();
    return;
  }

  openingRef.current = true;
  void runSqueeze(el).then(() => {
    openingRef.current = false;
    openNow();
  });
}

/** Creates the guard ref used by `runOpenAfterSqueeze`. */
export function useOpeningRef(): RefObject<boolean> {
  return useRef(false);
}
