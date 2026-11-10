import { bindKitRecipe } from "./bindKitRecipe";
import { hoverLiftFirstLevelRecipe } from "./hoverLiftFirstLevel";
import { pressSqueezeRecipe } from "./pressSqueeze";

/** First-level lift and press. Hosts that name these recipes call this on import. */
export function bindLiftRecipes(): void {
  bindKitRecipe("hoverLiftFirstLevel", hoverLiftFirstLevelRecipe);
  bindKitRecipe("pressSqueeze", pressSqueezeRecipe);
}
