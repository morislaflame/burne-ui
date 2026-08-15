import { registerMotionRecipe } from "../motionRecipeRegistry";
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

/** Idempotent — overwrites the same kit names. Safe to import from the public barrel. */
export function registerKitMotionRecipes(): void {
  registerMotionRecipe("hoverLiftSecondLevel", hoverLiftSecondLevelRecipe);
  registerMotionRecipe("hoverLiftGloss", hoverLiftGlossRecipe);
  registerMotionRecipe("hoverLiftFirstLevel", hoverLiftFirstLevelRecipe);
  registerMotionRecipe("pressSqueeze", pressSqueezeRecipe);
  registerMotionRecipe("pressSqueezeGloss", pressSqueezeGlossRecipe);
  registerMotionRecipe("collapsibleHeight", collapsibleHeightRecipe);
  registerMotionRecipe("chevronRotate", chevronRotateRecipe);
  registerMotionRecipe("portalSurfaceEnter", portalSurfaceEnterRecipe);
  registerMotionRecipe("portalSurfaceLeave", portalSurfaceLeaveRecipe);
  registerMotionRecipe("selectionFill", selectionFillRecipe);
  registerMotionRecipe("selectionMark", selectionMarkRecipe);
  registerMotionRecipe("modalOverlayEnter", modalOverlayEnterRecipe);
  registerMotionRecipe("modalOverlayLeave", modalOverlayLeaveRecipe);
  registerMotionRecipe("modalPanelEnter", modalPanelEnterRecipe);
  registerMotionRecipe("modalPanelLeave", modalPanelLeaveRecipe);
  registerMotionRecipe("drawerSlideEnter", drawerSlideEnterRecipe);
  registerMotionRecipe("drawerSlideLeave", drawerSlideLeaveRecipe);
  registerMotionRecipe("switchThumb", switchThumbRecipe);
  registerMotionRecipe("switchFill", switchFillRecipe);
  registerMotionRecipe("switchIconOn", switchIconOnRecipe);
  registerMotionRecipe("switchIconOff", switchIconOffRecipe);
  registerMotionRecipe("toastSurfaceEnter", toastSurfaceEnterRecipe);
  registerMotionRecipe("toastSurfaceLeave", toastSurfaceLeaveRecipe);
  registerMotionRecipe("contentFade", contentFadeRecipe);
  registerMotionRecipe("searchExpand", searchExpandRecipe);
  registerMotionRecipe("searchIconShift", searchIconShiftRecipe);
  registerMotionRecipe("fileRowExit", fileRowExitRecipe);
}

registerKitMotionRecipes();
