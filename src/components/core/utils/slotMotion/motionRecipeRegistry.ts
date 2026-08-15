import { KIT_MOTION_RECIPES, type KitRecipeName, type MotionRecipe } from "./slotMotionTypes";

const KIT_RECIPE_SET = new Set<string>(KIT_MOTION_RECIPES);

const kitRecipes = new Map<string, MotionRecipe>();
const appRecipes = new Map<string, MotionRecipe>();

export type RegisterMotionRecipeOptions = {
  /**
   * Replace a kit recipe (`hoverLiftSecondLevel`, …).
   * Custom names never need this — re-registering them just replaces the previous app entry.
   */
  override?: boolean;
};

export function isKitMotionRecipe(name: string): name is KitRecipeName {
  return KIT_RECIPE_SET.has(name);
}

/**
 * Write the kit layer only. Does not touch app overrides, so a later
 * `registerKitMotionRecipes()` (HMR / re-import) cannot wipe `{ override: true }`.
 */
export function registerKitMotionRecipe(name: KitRecipeName, recipe: MotionRecipe): void {
  kitRecipes.set(name, recipe);
}

/**
 * Register an app recipe. Custom names always write.
 * Kit names no-op in dev with a warning unless `{ override: true }`.
 */
export function registerMotionRecipe(
  name: string,
  recipe: MotionRecipe,
  options?: RegisterMotionRecipeOptions,
): void {
  if (!name) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[burne-ui] registerMotionRecipe: name must be a non-empty string");
    }
    return;
  }
  if (isKitMotionRecipe(name) && !options?.override) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[burne-ui] "${name}" is a kit recipe. Pass { override: true } to replace it everywhere, or register a new name and use it in motion.*.`,
      );
    }
    return;
  }
  appRecipes.set(name, recipe);
}

/** Remove an app entry. Kit names fall back to the kit default. */
export function unregisterMotionRecipe(name: string): boolean {
  return appRecipes.delete(name);
}

export function getMotionRecipe(name: string): MotionRecipe | undefined {
  return appRecipes.get(name) ?? kitRecipes.get(name);
}

export function hasMotionRecipe(name: string): boolean {
  return getMotionRecipe(name) !== undefined;
}

/** Kit names plus any app custom / override names, sorted. */
export function listMotionRecipes(): string[] {
  const names = new Set<string>(kitRecipes.keys());
  for (const name of appRecipes.keys()) names.add(name);
  return [...names].sort();
}

/** Test helper — clears app overrides/custom names, not kit defaults. */
export function clearMotionRecipesForTests(): void {
  appRecipes.clear();
}
