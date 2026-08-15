import { registerKitMotionRecipe } from "../motionRecipeRegistry";
import { chevronRotateRecipe } from "./chevronRotate";
import { collapsibleHeightRecipe } from "./collapsibleHeight";
import { hoverLiftFirstLevelRecipe } from "./hoverLiftFirstLevel";
import { hoverLiftGlossRecipe } from "./hoverLiftGloss";
import { hoverLiftSecondLevelRecipe } from "./hoverLiftSecondLevel";
import {
  modalOverlayEnterRecipe,
  modalOverlayLeaveRecipe,
  modalPanelEnterRecipe,
  modalPanelLeaveRecipe,
} from "./modalSurface";
import { drawerSlideEnterRecipe, drawerSlideLeaveRecipe } from "./drawerSlide";
import { portalSurfaceEnterRecipe, portalSurfaceLeaveRecipe } from "./portalSurface";
import { pressSqueezeGlossRecipe, pressSqueezeRecipe } from "./pressSqueeze";
import { selectionFillRecipe } from "./selectionFill";
import { selectionMarkRecipe } from "./selectionMark";
import {
  switchFillRecipe,
  switchIconOffRecipe,
  switchIconOnRecipe,
  switchThumbRecipe,
} from "./switchThumb";
import { toastSurfaceEnterRecipe, toastSurfaceLeaveRecipe } from "./toastSurface";
import { contentFadeRecipe } from "./contentFade";
import { fileRowExitRecipe } from "./fileRowExit";
import { searchExpandRecipe, searchIconShiftRecipe } from "./searchExpand";

/** Idempotent kit-layer write. Does not clear app overrides (`{ override: true }`). */
export function registerKitMotionRecipes(): void {
  registerKitMotionRecipe("hoverLiftSecondLevel", hoverLiftSecondLevelRecipe);
  registerKitMotionRecipe("hoverLiftGloss", hoverLiftGlossRecipe);
  registerKitMotionRecipe("hoverLiftFirstLevel", hoverLiftFirstLevelRecipe);
  registerKitMotionRecipe("pressSqueeze", pressSqueezeRecipe);
  registerKitMotionRecipe("pressSqueezeGloss", pressSqueezeGlossRecipe);
  registerKitMotionRecipe("collapsibleHeight", collapsibleHeightRecipe);
  registerKitMotionRecipe("chevronRotate", chevronRotateRecipe);
  registerKitMotionRecipe("portalSurfaceEnter", portalSurfaceEnterRecipe);
  registerKitMotionRecipe("portalSurfaceLeave", portalSurfaceLeaveRecipe);
  registerKitMotionRecipe("selectionFill", selectionFillRecipe);
  registerKitMotionRecipe("selectionMark", selectionMarkRecipe);
  registerKitMotionRecipe("modalOverlayEnter", modalOverlayEnterRecipe);
  registerKitMotionRecipe("modalOverlayLeave", modalOverlayLeaveRecipe);
  registerKitMotionRecipe("modalPanelEnter", modalPanelEnterRecipe);
  registerKitMotionRecipe("modalPanelLeave", modalPanelLeaveRecipe);
  registerKitMotionRecipe("drawerSlideEnter", drawerSlideEnterRecipe);
  registerKitMotionRecipe("drawerSlideLeave", drawerSlideLeaveRecipe);
  registerKitMotionRecipe("switchThumb", switchThumbRecipe);
  registerKitMotionRecipe("switchFill", switchFillRecipe);
  registerKitMotionRecipe("switchIconOn", switchIconOnRecipe);
  registerKitMotionRecipe("switchIconOff", switchIconOffRecipe);
  registerKitMotionRecipe("toastSurfaceEnter", toastSurfaceEnterRecipe);
  registerKitMotionRecipe("toastSurfaceLeave", toastSurfaceLeaveRecipe);
  registerKitMotionRecipe("contentFade", contentFadeRecipe);
  registerKitMotionRecipe("searchExpand", searchExpandRecipe);
  registerKitMotionRecipe("searchIconShift", searchIconShiftRecipe);
  registerKitMotionRecipe("fileRowExit", fileRowExitRecipe);
}

registerKitMotionRecipes();
