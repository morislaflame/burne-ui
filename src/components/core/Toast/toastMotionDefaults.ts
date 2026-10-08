import { overlaySkinMotion } from "@/skins/resolveVariantVisual";

import type { ToastMotion, ToastVariant } from "./toastTypes";
import { KIT_TOAST_VARIANTS } from "./toastTypes";

export const TOAST_MOTION_DEFAULTS: ToastMotion = {
  root: { enter: "toastSurfaceEnter", leave: "toastSurfaceLeave" },
  stackItem: { enter: "toastStackShift", change: "toastStackShift" },
};

/** Viewport scope: scrim only. Card defaults stay on each item. */
export const TOAST_VIEWPORT_MOTION_DEFAULTS: ToastMotion = {
  scrim: { enter: "toastScrimFade", leave: "toastScrimFade" },
};

export function resolveToastMotionDefaults(variant: ToastVariant): ToastMotion {
  return overlaySkinMotion(TOAST_MOTION_DEFAULTS, variant, KIT_TOAST_VARIANTS, "toast");
}
