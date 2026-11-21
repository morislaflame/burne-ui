import { registerKitMotionRecipe } from "../motionRecipeRegistry";
import type { KitRecipeName, MotionRecipe } from "../slotMotionTypes";

const bound = new Set<string>();

/** Register one kit recipe. A second call from another host is a no-op. */
export function bindKitRecipe(name: KitRecipeName, recipe: MotionRecipe): void {
  if (bound.has(name)) return;
  bound.add(name);
  registerKitMotionRecipe(name, recipe);
}
