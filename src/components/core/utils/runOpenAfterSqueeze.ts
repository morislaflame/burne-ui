import { useRef, type RefObject } from "react";
 
import { animateInteractivePressSqueeze } from "./hoverInteractiveLift";
import { prefersReducedMotion } from "./reducedMotion";
import type { MotionConfig } from "./motionConfig";
 
/**
 * Joined segment paints its fill on the shell. A non-identity rest scale
 * (`1.0001`) rasterizes that fill about 1px outside the group frame when
 * the control height is fractional (theme shuffle). Scale the inner motion
 * node instead.
 */
export function groupSegmentMotionEl(el: HTMLElement): HTMLElement {
  if (!el.hasAttribute("data-group-segment")) return el;
  const inner = el.querySelector(":scope .button-group-motion");
  return inner instanceof HTMLElement ? inner : el;
}

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
 * / other surface plugins can inject their own squeeze without forking this helper.
   */
  runSqueeze?: (el: HTMLElement) => Promise<void>;
  /** Scoped motion config for the default squeeze. */
  config?: Readonly<MotionConfig>;
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
 * - Variant-agnostic: default squeeze is standard; is not branched here.
 *
 * Use `useOpeningRef()` to create the required `openingRef`.
 */
export function runOpenAfterSqueeze({
  triggerRef,
  openingRef,
  setOpen,
  disabled = false,
  onOpened,
  config,
  runSqueeze = (el) => animateInteractivePressSqueeze(groupSegmentMotionEl(el), { config }),
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
  // The child control reads this and skips its own press while the trigger plays one.
  el.dataset.overlayOpening = "true";
  void Promise.resolve()
    .then(() => runSqueeze(el))
    .then(() => {
      openNow();
    })
    .finally(() => {
      openingRef.current = false;
      delete el.dataset.overlayOpening;
    });
}
 
/** Creates the guard ref used by `runOpenAfterSqueeze`. */
export function useOpeningRef(): RefObject<boolean> {
  return useRef(false);
}
 