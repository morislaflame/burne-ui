import type { MotionRecipe } from "./slotMotionTypes";

const recipes = new Map<string, MotionRecipe>();

/** Register or replace a named recipe (kit defaults or app/plugin overrides). */
export function registerMotionRecipe(name: string, recipe: MotionRecipe): void {
  recipes.set(name, recipe);
}

export function getMotionRecipe(name: string): MotionRecipe | undefined {
  return recipes.get(name);
}

/** Test helper — not part of the app API. */
export function clearMotionRecipesForTests(): void {
  recipes.clear();
}
