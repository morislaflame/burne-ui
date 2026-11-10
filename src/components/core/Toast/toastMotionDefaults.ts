import { isKitVariant, overlaySkinMotion } from "@/skins/resolveVariantVisual";

import type { ToastMotion, ToastVariant } from "./toastTypes";
import { KIT_TOAST_VARIANTS } from "./toastTypes";

import { bindToastRecipes } from "@/components/core/utils/slotMotion/recipes/bindToast";
import { bindSecondLevelRecipe } from "@/components/core/utils/slotMotion/recipes/bindSecondLevel";

bindToastRecipes();
bindSecondLevelRecipe();

export const TOAST_MOTION_DEFAULTS: ToastMotion = {
  root: {
    enter: "toastSurfaceEnter",
    leave: "toastSurfaceLeave",
    hoverIn: "hoverLiftSecondLevel",
    hoverOut: "hoverLiftSecondLevel",
  },
  stackItem: { enter: "toastStackShift", change: "toastStackShift" },
};

/** Kit cards hover-lift. A skin keeps enter/leave and only the hover it declares itself. */
function toastMotionFor(variant: ToastVariant): ToastMotion {
  if (isKitVariant(variant, KIT_TOAST_VARIANTS)) return TOAST_MOTION_DEFAULTS;
  return {
    ...TOAST_MOTION_DEFAULTS,
    root: {
      enter: "toastSurfaceEnter",
      leave: "toastSurfaceLeave",
    },
  };
}

/** Viewport scope: scrim only. Card defaults stay on each item. */
export const TOAST_VIEWPORT_MOTION_DEFAULTS: ToastMotion = {
  scrim: { enter: "toastScrimFade", leave: "toastScrimFade" },
};

export function resolveToastMotionDefaults(variant: ToastVariant): ToastMotion {
  return overlaySkinMotion(toastMotionFor(variant), variant, KIT_TOAST_VARIANTS, "toast");
}
