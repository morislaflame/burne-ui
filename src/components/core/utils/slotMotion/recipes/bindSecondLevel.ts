import { bindKitRecipe } from "./bindKitRecipe";
import { hoverLiftSecondLevelRecipe } from "./hoverLiftSecondLevel";

export function bindSecondLevelRecipe(): void {
  bindKitRecipe("hoverLiftSecondLevel", hoverLiftSecondLevelRecipe);
}
