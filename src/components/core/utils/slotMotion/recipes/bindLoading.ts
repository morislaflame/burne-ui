import { bindKitRecipe } from "./bindKitRecipe";
import { loadingDotsRecipe } from "./loadingDots";

export function bindLoadingRecipe(): void {
  bindKitRecipe("loadingDots", loadingDotsRecipe);
}
