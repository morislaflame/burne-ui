import { bindKitRecipe } from "./bindKitRecipe";
import { progressFillRecipe, progressIndeterminateRecipe } from "./progressFill";

export function bindProgressRecipes(): void {
  bindKitRecipe("progressFill", progressFillRecipe);
  bindKitRecipe("progressIndeterminate", progressIndeterminateRecipe);
}
