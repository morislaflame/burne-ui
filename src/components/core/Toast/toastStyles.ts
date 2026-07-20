import { GLOSS_INTERACTIVE_MOTION_CLASS } from "@/components/core/utils/glossInteractiveMotion";
import {
  messageBannerGridClass,
} from "@/components/core/utils/messageBannerGridLayout";
import type { MessageBannerGridSlots } from "@/components/core/utils/messageBannerGridLayout";
import {
  messageBannerSizePreset,
} from "@/components/core/utils/messageBannerSize";
import { cn } from "@/utils/cn";

import type { LoadingColor } from "@/components/core/Loading";

import type { ToastPlacement, ToastSize, ToastStatus, ToastVariant } from "./toastTypes";

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

export const TOAST_TITLE_CLASS = "font-w-mid";

export const TOAST_DESCRIPTION_CLASS = "text-muted";

export const TOAST_CLOSE_BUTTON_OFFSET_CLASS = "-mx-xsmall";

export const TOAST_INDICATOR_BASE_CLASS =
  "inline-flex shrink-0 items-center justify-center";

export function toastIndicatorClass(
  status: ToastStatus,
  iconSvgClass: string,
  slotClass?: string,
) {
  return cn(
    TOAST_INDICATOR_BASE_CLASS,
    iconSvgClass,
    TOAST_ICON_CLASS[status],
    slotClass,
  );
}

const TOAST_LOADING_COLOR: Record<ToastStatus, LoadingColor> = {
  default: "primary",
  success: "success",
  danger: "danger",
  info: "info",
  warning: "warning",
};

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

export function toastLoadingColor(status: ToastStatus): LoadingColor {
  return TOAST_LOADING_COLOR[status];
}

export function toastRootClass({
  variant,
  status,
  size,
  gridSlots,
  slotClass,
  className,
}: {
  variant: ToastVariant;
  status: ToastStatus;
  size?: ToastSize;
  gridSlots: MessageBannerGridSlots;
  slotClass?: string;
  className?: string;
}) {
  const isGloss = variant === "gloss";
  const preset = messageBannerSizePreset(size);

  return cn(
    messageBannerGridClass(gridSlots, preset.gridGap),
    `w-full ${preset.shellPadding}`,
    isGloss
      ? cn("gloss-panel gloss-deep border-0 text-foreground", GLOSS_INTERACTIVE_MOTION_CLASS)
      : cn("shadow-token-mid", TOAST_SURFACE_CLASS[status]),
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
  return cn(
    TOAST_VIEWPORT_BASE_CLASS,
    toastPlacementClass(placement),
    slotClass,
  );
}

export function toastStackClass(slotClass?: string) {
  return cn(TOAST_STACK_CONTAINER_CLASS, slotClass);
}

export function toastScrimClass(slotClass?: string) {
  return cn(TOAST_SCRIM_BASE_CLASS, slotClass);
}
