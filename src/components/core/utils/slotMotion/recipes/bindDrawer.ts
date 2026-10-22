import { bindKitRecipe } from "./bindKitRecipe";
import { drawerSlideEnterRecipe, drawerSlideLeaveRecipe } from "./drawerSlide";

export function bindDrawerRecipes(): void {
  bindKitRecipe("drawerSlideEnter", drawerSlideEnterRecipe);
  bindKitRecipe("drawerSlideLeave", drawerSlideLeaveRecipe);
}
