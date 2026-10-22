import {
  registerMotionRecipe,
  type MotionRecipe,
  type RegisterMotionRecipeOptions,
} from "@/components/core/utils/slotMotion";
import { registerSkin } from "@/skins/skinRegistry";
import type { SkinDefinition } from "@/skins/skinTypes";

const INTERACTIVE_LOCAL = /^(hover|press)(-|$)/;

/** `gloss` + `hover` → `gloss:hover`. */
export function skinRecipeName(skin: string, local: string): string {
  if (!/^[a-z][a-z0-9-]*$/.test(skin)) {
    throw new Error(`Skin name must be kebab-case, received ${skin}`);
  }
  if (!/^[a-z][a-z0-9-]*$/.test(local)) {
    throw new Error(`Skin recipe name must be kebab-case, received ${local}`);
  }
  return `${skin}:${local}`;
}

/**
 * Registers `skin:local`. `hover` and `press` are interactive unless the caller says otherwise.
 * Returns the registered name so the motion map and the registry stay the same string.
 */
export function defineSkinRecipe(
  skin: string,
  local: string,
  recipe: MotionRecipe,
  options?: RegisterMotionRecipeOptions,
): string {
  const name = skinRecipeName(skin, local);
  const interactive = options?.interactive ?? INTERACTIVE_LOCAL.test(local);
  registerMotionRecipe(name, recipe, { ...options, interactive });
  return name;
}

/** Registers the skin and returns the same object. */
export function defineSkin<T extends SkinDefinition>(definition: T): T {
  registerSkin(definition);
  return definition;
}
