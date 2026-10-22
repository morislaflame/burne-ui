import { bindKitRecipe } from "./bindKitRecipe";
import { toastScrimFadeRecipe } from "./toastScrimFade";
import { toastStackShiftRecipe } from "./toastStackShift";
import { toastSurfaceEnterRecipe, toastSurfaceLeaveRecipe } from "./toastSurface";

export function bindToastRecipes(): void {
  bindKitRecipe("toastSurfaceEnter", toastSurfaceEnterRecipe);
  bindKitRecipe("toastSurfaceLeave", toastSurfaceLeaveRecipe);
  bindKitRecipe("toastStackShift", toastStackShiftRecipe);
  bindKitRecipe("toastScrimFade", toastScrimFadeRecipe);
}
