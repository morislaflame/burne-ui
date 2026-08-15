import {
  isMotionFactory,
  isMotionVarsObject,
  type MotionValue,
} from "./slotMotionTypes";

/**
 * Kit enter recipes that start hidden. Used by `hideNestedEnterSlots` so a
 * string recipe does not FOUC. Host portal recipes (`portalSurfaceEnter`,
 * `modalPanelEnter`, `toastSurfaceEnter`) are **not** listed — they keep the
 * surface visible (`opacity` / `preparePortalSurfaceForEnter`).
 */
export const KIT_ENTER_HIDES_FIRST_PAINT: ReadonlySet<string> = new Set(["contentFade"]);

/**
 * Whether nested `enter` should `gsap.set(autoAlpha: 0)` before play.
 * Factory functions cannot be inspected — use `{ recipe: "name", firstPaint: "hidden" }`
 * or vars with `autoAlpha` / `firstPaint: "hidden"`.
 */
export function enterHidesFirstPaint(value: MotionValue | undefined): boolean {
  if (value === undefined || value === false) return false;
  if (isMotionFactory(value)) return false;
  if (typeof value === "string") return KIT_ENTER_HIDES_FIRST_PAINT.has(value);
  if (!isMotionVarsObject(value)) return false;
  if (value.firstPaint === "hidden") return true;
  if (value.firstPaint === "visible") return false;
  if (value.autoAlpha !== undefined) return true;
  if (typeof value.recipe === "string") return KIT_ENTER_HIDES_FIRST_PAINT.has(value.recipe);
  return false;
}
