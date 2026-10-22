import { bindKitRecipe } from "./bindKitRecipe";
import { tabsIndicatorMoveRecipe } from "./tabsIndicatorMove";

export function bindTabsRecipe(): void {
  bindKitRecipe("tabsIndicatorMove", tabsIndicatorMoveRecipe);
}
