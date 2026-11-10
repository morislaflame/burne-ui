import { bindKitRecipe } from "./bindKitRecipe";
import { searchExpandRecipe, searchIconShiftRecipe } from "./searchExpand";

export function bindSearchRecipes(): void {
  bindKitRecipe("searchExpand", searchExpandRecipe);
  bindKitRecipe("searchIconShift", searchIconShiftRecipe);
}
