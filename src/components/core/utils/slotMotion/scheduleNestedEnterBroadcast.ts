import type { MotionScopeValue } from "./createMotionScope";

/**
 * After host enter + `hideNestedEnterSlots`, start nested enter on the next frame.
 *
 * Nested kit recipes tween compositor props (`opacity` / `x` / `y`). A layout
 * flush (`offsetHeight`) here would walk the whole overlay tree — skip it.
 * Host surfaces stay visible via `preparePortalSurfaceForEnter` / portal recipes.
 * Native `<dialog>` still flushes in `flushDialogOpenLayout` after `showModal()`.
 */
export function scheduleNestedEnterBroadcast(
  scope: Pick<MotionScopeValue, "playBroadcast">,
  exclude: readonly string[],
  shouldPlay: () => boolean = () => true,
): number {
  return requestAnimationFrame(() => {
    if (!shouldPlay()) return;
    void scope.playBroadcast("enter", { exclude: [...exclude] });
  });
}

/** Cancel a pending nested-enter rAF and invalidate its generation (unmount / next play). */
export function invalidateEnterFrame(
  frameRef: { current: number },
  genRef: { current: number },
): void {
  genRef.current += 1;
  if (frameRef.current) {
    cancelAnimationFrame(frameRef.current);
    frameRef.current = 0;
  }
}
