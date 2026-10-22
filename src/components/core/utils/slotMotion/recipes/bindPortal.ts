import { bindKitRecipe } from "./bindKitRecipe";
import { portalSurfaceEnterRecipe, portalSurfaceLeaveRecipe } from "./portalSurface";

export function bindPortalRecipes(): void {
  bindKitRecipe("portalSurfaceEnter", portalSurfaceEnterRecipe);
  bindKitRecipe("portalSurfaceLeave", portalSurfaceLeaveRecipe);
}
