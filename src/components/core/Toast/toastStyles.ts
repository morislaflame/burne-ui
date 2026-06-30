import { GLOSS_INTERACTIVE_MOTION_CLASS } from "@/components/core/utils/glossInteractiveMotion";
import {
  messageBannerGridClass,
} from "@/components/core/utils/messageBannerGridLayout";
import type { MessageBannerGridSlots } from "@/components/core/utils/messageBannerGridLayout";
import { cn } from "@/utils/cn";

import { mergeToastSlotClass, TOAST_WIDTH_PX } from "./toastAPI";
import type { ToastPlacement, ToastStatus, ToastVariant } from "./toastTypes";

export { TOAST_WIDTH_PX };

export const TOAST_SURFACE_CLASS: Record<ToastStatus, string> = {
  default: "bg-surface border-token text-foreground",
  success: "bg-surface-tint-success border-token text-foreground",
  danger: "bg-surface-tint-danger border-token text-foreground",
  info: "bg-surface-tint-info border-token text-foreground",
  warning: "bg-surface-tint-warning border-token text-foreground",
};

export const TOAST_ICON_CLASS: Record<ToastStatus, string> = {
  default: "text-primary",
  success: "text-success",
  danger: "text-danger",
  info: "text-info",
  warning: "text-warning",
};

export const TOAST_COMPOUND_CONTENTS_CLASS = "contents";

export const TOAST_TITLE_CLASS = "font-medium";

export const TOAST_DESCRIPTION_CLASS = "text-muted";

export const TOAST_CLOSE_BUTTON_OFFSET_CLASS = "-mx-xsmall";

export const TOAST_INDICATOR_ICON_CLASS = "[&_svg]:icon-mid";

export const TOAST_STACK_LAYER_CLASS = "will-change-transform";

export const TOAST_VIEWPORT_BASE_CLASS = "fixed z-[300] pointer-events-none";

export const TOAST_STACK_CONTAINER_CLASS = "relative grid";

export const TOAST_SCRIM_BASE_CLASS = "pointer-events-none absolute";

const PLACEMENT_CLASS: Record<ToastPlacement, string> = {
  "top-left": "top-4 left-4",
  "top-center": "top-4 left-1/2 -translate-x-1/2",
  "top-right": "top-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
  "bottom-right": "bottom-4 right-4",
};

export function toastPlacementClass(placement: ToastPlacement): string {
  return PLACEMENT_CLASS[placement];
}

export function toastIndicatorClass(status: ToastStatus, slotClass?: string) {
  return mergeToastSlotClass(TOAST_INDICATOR_ICON_CLASS, TOAST_ICON_CLASS[status], slotClass);
}

export function toastRootClass({
  variant,
  status,
  gridSlots,
  slotClass,
  className,
}: {
  variant: ToastVariant;
  status: ToastStatus;
  gridSlots: MessageBannerGridSlots;
  slotClass?: string;
  className?: string;
}) {
  const isGloss = variant === "gloss";

  return mergeToastSlotClass(
    messageBannerGridClass(gridSlots),
    "w-full rounded-mid py-base px-plus",
    isGloss
      ? cn("gloss-panel gloss-deep border-0 text-foreground", GLOSS_INTERACTIVE_MOTION_CLASS)
      : cn("shadow-token-md", TOAST_SURFACE_CLASS[status]),
    slotClass,
    className,
  );
}

export function toastViewportClass({
  placement,
  slotClass,
}: {
  placement: ToastPlacement;
  slotClass?: string;
}) {
  return mergeToastSlotClass(
    TOAST_VIEWPORT_BASE_CLASS,
    toastPlacementClass(placement),
    slotClass,
  );
}

export function toastStackClass(slotClass?: string) {
  return mergeToastSlotClass(TOAST_STACK_CONTAINER_CLASS, slotClass);
}

export function toastScrimClass(slotClass?: string) {
  return mergeToastSlotClass(TOAST_SCRIM_BASE_CLASS, slotClass);
}
