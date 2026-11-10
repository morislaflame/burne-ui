import { bindKitRecipe } from "./bindKitRecipe";
import { selectionFillRecipe } from "./selectionFill";
import { selectionMarkRecipe } from "./selectionMark";

export function bindSelectionFillRecipe(): void {
  bindKitRecipe("selectionFill", selectionFillRecipe);
}

export function bindSelectionRecipes(): void {
  bindSelectionFillRecipe();
  bindKitRecipe("selectionMark", selectionMarkRecipe);
}
