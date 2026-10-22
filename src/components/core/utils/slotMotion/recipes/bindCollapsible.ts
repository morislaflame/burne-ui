import { bindKitRecipe } from "./bindKitRecipe";
import { collapsibleHeightRecipe } from "./collapsibleHeight";

export function bindCollapsibleRecipe(): void {
  bindKitRecipe("collapsibleHeight", collapsibleHeightRecipe);
}
