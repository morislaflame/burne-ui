import { registerKitMotionRecipe } from "../motionRecipeRegistry";
import { chevronRotateRecipe } from "./chevronRotate";
import { collapsibleHeightRecipe } from "./collapsibleHeight";
import { hoverLiftFirstLevelRecipe } from "./hoverLiftFirstLevel";
import { hoverLiftSecondLevelRecipe } from "./hoverLiftSecondLevel";
import {
  modalOverlayEnterRecipe,
  modalOverlayLeaveRecipe,
  modalPanelEnterRecipe,
  modalPanelLeaveRecipe,
} from "./modalSurface";
import { drawerSlideEnterRecipe, drawerSlideLeaveRecipe } from "./drawerSlide";
import { portalSurfaceEnterRecipe, portalSurfaceLeaveRecipe } from "./portalSurface";
import { pressSqueezeRecipe } from "./pressSqueeze";
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
import { progressFillRecipe, progressIndeterminateRecipe } from "./progressFill";
import { toastStackShiftRecipe } from "./toastStackShift";
import { toastScrimFadeRecipe } from "./toastScrimFade";
import { tabsIndicatorMoveRecipe } from "./tabsIndicatorMove";
import { loadingDotsRecipe } from "./loadingDots";
 
/** Idempotent kit-layer write. Does not clear app overrides (`{ override: true }`). */
export function registerKitMotionRecipes(): void {
  registerKitMotionRecipe("hoverLiftSecondLevel", hoverLiftSecondLevelRecipe);
  registerKitMotionRecipe("hoverLiftFirstLevel", hoverLiftFirstLevelRecipe);
  registerKitMotionRecipe("pressSqueeze", pressSqueezeRecipe);
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
  registerKitMotionRecipe("progressFill", progressFillRecipe);
  registerKitMotionRecipe("progressIndeterminate", progressIndeterminateRecipe);
  registerKitMotionRecipe("toastStackShift", toastStackShiftRecipe);
  registerKitMotionRecipe("toastScrimFade", toastScrimFadeRecipe);
  registerKitMotionRecipe("tabsIndicatorMove", tabsIndicatorMoveRecipe);
  registerKitMotionRecipe("loadingDots", loadingDotsRecipe);
}
 
