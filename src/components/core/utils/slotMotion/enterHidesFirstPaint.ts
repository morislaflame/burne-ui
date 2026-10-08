import { KIT_ENTER_HIDES_FIRST_PAINT } from "./kitMotionRecipeMeta";
import { getMotionRecipeMetadata } from "./motionRecipeRegistry";
import {
  isMotionFactory,
  isMotionVarsObject,
  type MotionValue,
} from "./slotMotionTypes";
 
export { KIT_ENTER_HIDES_FIRST_PAINT } from "./kitMotionRecipeMeta";
 
function recipeHidesFirstPaint(name: string): boolean {
  const live = getMotionRecipeMetadata(name);
  if (live) return live.hidesFirstPaint;
  return KIT_ENTER_HIDES_FIRST_PAINT.has(name);
}
 
/**
 * Whether nested `enter` should `gsap.set(autoAlpha: 0)` before play.
 * Named recipes use `MotionRecipeMetadata.hidesFirstPaint` (kit: `contentFade`;
 * app: `registerMotionRecipe("myFade", fn, { hidesFirstPaint: true })`).
 * Factory functions cannot be inspected — use `{ recipe: "name", firstPaint: "hidden" }`
 * or vars with `autoAlpha` / `firstPaint: "hidden"`.
 */
export function enterHidesFirstPaint(value: MotionValue | undefined): boolean {
  if (value === undefined || value === false) return false;
  if (isMotionFactory(value)) return false;
  if (typeof value === "string") return recipeHidesFirstPaint(value);
  if (!isMotionVarsObject(value)) return false;
  if (value.firstPaint === "hidden") return true;
  if (value.firstPaint === "visible") return false;
  if (value.autoAlpha !== undefined) return true;
  if (typeof value.recipe === "string") return recipeHidesFirstPaint(value.recipe);
  return false;
}
 