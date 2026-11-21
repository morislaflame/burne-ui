import { bindKitRecipe } from "./bindKitRecipe";
import {
  modalOverlayEnterRecipe,
  modalOverlayLeaveRecipe,
  modalPanelEnterRecipe,
  modalPanelLeaveRecipe,
} from "./modalSurface";

export function bindModalRecipes(): void {
  bindKitRecipe("modalOverlayEnter", modalOverlayEnterRecipe);
  bindKitRecipe("modalOverlayLeave", modalOverlayLeaveRecipe);
  bindKitRecipe("modalPanelEnter", modalPanelEnterRecipe);
  bindKitRecipe("modalPanelLeave", modalPanelLeaveRecipe);
}
