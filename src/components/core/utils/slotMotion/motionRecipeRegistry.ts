import { KIT_MOTION_RECIPE_META } from "./kitMotionRecipeMeta";
import {
  KIT_MOTION_RECIPES,
  MOTION_RECIPE_METADATA_DEFAULTS,
  type KitRecipeName,
  type MotionRecipe,
  type MotionRecipeMetadata,
} from "./slotMotionTypes";
 
const KIT_RECIPE_SET = new Set<string>(KIT_MOTION_RECIPES);
 
type RecipeEntry = {
  recipe: MotionRecipe;
  meta: MotionRecipeMetadata;
};
 
const kitRecipes = new Map<string, RecipeEntry>();
const appRecipes = new Map<string, RecipeEntry>();
 
export type RegisterMotionRecipeOptions = {
  /**
   * Replace a kit recipe (`hoverLiftSecondLevel`, …).
   * Custom names never need this — re-registering them just replaces the previous app entry.
   */
  override?: boolean;
} & Partial<MotionRecipeMetadata>;
 
export function isKitMotionRecipe(name: string): name is KitRecipeName {
  return KIT_RECIPE_SET.has(name);
}
 
function omitOverride(
  options?: RegisterMotionRecipeOptions,
): Partial<MotionRecipeMetadata> {
  if (!options) return {};
  const { override: _override, ...meta } = options;
  return meta;
}
 
function mergeRecipeMeta(
  base: MotionRecipeMetadata,
  overlay?: Partial<MotionRecipeMetadata>,
): MotionRecipeMetadata {
  if (!overlay) return base;
  return { ...base, ...overlay };
}
 
/**
 * Write the kit layer only. Does not touch app overrides, so a later
 * `registerKitMotionRecipes()` (HMR / re-import) cannot wipe `{ override: true }`.
 * Metadata comes from `KIT_MOTION_RECIPE_META`.
 */
export function registerKitMotionRecipe(name: KitRecipeName, recipe: MotionRecipe): void {
  kitRecipes.set(name, { recipe, meta: KIT_MOTION_RECIPE_META[name] });
}
 
/**
 * Register an app recipe. Custom names always write.
 * Kit names no-op in dev with a warning unless `{ override: true }`.
 * Metadata overlays kit (on override) or `MOTION_RECIPE_METADATA_DEFAULTS` (new name).
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
  const base = kitRecipes.get(name)?.meta ?? MOTION_RECIPE_METADATA_DEFAULTS;
  appRecipes.set(name, {
    recipe,
    meta: mergeRecipeMeta(base, omitOverride(options)),
  });
}
 
/** Remove an app entry. Kit names fall back to the kit default. */
export function unregisterMotionRecipe(name: string): boolean {
  return appRecipes.delete(name);
}
 
function getEntry(name: string): RecipeEntry | undefined {
  return appRecipes.get(name) ?? kitRecipes.get(name);
}
 
export function getMotionRecipe(name: string): MotionRecipe | undefined {
  return getEntry(name)?.recipe;
}
 
/** Live passport (app overlay wins, then kit, then nothing). */
export function getMotionRecipeMetadata(name: string): MotionRecipeMetadata | undefined {
  return getEntry(name)?.meta;
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
 