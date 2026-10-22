import type { CSSProperties } from "react";

/** Visually hidden, always-mounted live region for toast announcements. */
export const TOAST_LIVE_REGION_CLASS =
  "sr-only absolute m-0 h-px w-px overflow-hidden whitespace-nowrap border-0 p-0";

import { messageBannerGridClass } from "@/components/core/utils/messageBannerGridLayout";
import type { MessageBannerGridSlots } from "@/components/core/utils/messageBannerGridLayout";
import { messageBannerSizePreset } from "@/components/core/utils/sizeLayout";
import { resolveVariantVisual } from "@/skins/resolveVariantVisual";
import { cn } from "@/utils/cn";


import type { KitToastVariant, ToastPlacement, ToastSize, ToastStatus, ToastVariant } from "./toastTypes";
import { KIT_TOAST_VARIANTS } from "./toastTypes";
 
/** Neutral shell for every status — accents live on the indicator icon. */
export const TOAST_VARIANT_SURFACE: Record<KitToastVariant, string> = {
  default: "bg-surface border-token text-foreground",
  outline: "bg-transparent border-token-outline text-foreground",
  secondary: "bg-secondary border-token text-secondary-foreground",
};

/** Rest elevation of the kit card. `useSecondLevelShadow` owns it so hover can grow it. */
export const TOAST_SHADOW_SIZE = "mid" as const;
 
export const TOAST_ICON_CLASS: Record<ToastStatus, string> = {
  default: "text-primary",
  success: "text-success",
  danger: "text-danger",
  info: "text-info",
  warning: "text-warning",
};
 
export const TOAST_COMPOUND_CONTENTS_CLASS = "contents";
 
export const TOAST_TITLE_CLASS = "font-w-mid";
 
export function toastTitleClass(status: ToastStatus): string {
  return cn(
    TOAST_TITLE_CLASS,
    status !== "default" ? TOAST_ICON_CLASS[status] : "",
  );
}
 
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
 
export const TOAST_VIEWPORT_BASE_CLASS =
  "fixed z-toast pointer-events-none w-[var(--toast-viewport-width)]";

export const TOAST_STACK_ITEM_CLASS =
  "col-start-1 row-start-1 [z-index:var(--toast-stack-z)] [pointer-events:var(--toast-stack-events)] [transform-origin:var(--toast-stack-origin)]";
 
/** Height is `--toast-stack-height` (front card). Not a tween — layout. */
export const TOAST_STACK_CONTAINER_CLASS = "relative grid h-[var(--toast-stack-height,auto)]";
 
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
 
export function toastRootClass({
  variant,
  size,
  gridSlots,
  slotClass,
  className,
  liftClass,
}: {
  variant: ToastVariant;
  size?: ToastSize;
  gridSlots: MessageBannerGridSlots;
  slotClass?: string;
  className?: string;
  /** `animate-shadow` from `useSecondLevelShadow`. Kit default only. */
  liftClass?: string;
}) {
  const visual = resolveVariantVisual(variant, KIT_TOAST_VARIANTS, "toast.root");
  const preset = messageBannerSizePreset(size);

  return cn(
    messageBannerGridClass(gridSlots, preset.gridGap),
    `w-full ${preset.shellPadding}`,
    visual.className !== undefined
      ? visual.className
      : cn(TOAST_VARIANT_SURFACE[visual.key], liftClass),
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

export function toastStackItemClass(slotClass?: string) {
  return cn(TOAST_STACK_ITEM_CLASS, slotClass);
}

export function toastStackItemStyle({
  origin,
  zIndex,
  pointerEvents,
}: {
  origin: "top center" | "bottom center";
  zIndex: number;
  pointerEvents: "auto" | "none";
}): CSSProperties {
  return {
    "--toast-stack-origin": origin,
    "--toast-stack-z": zIndex,
    "--toast-stack-events": pointerEvents,
  } as CSSProperties;
}

export function toastViewportWidthStyle(widthPx: number): CSSProperties {
  return { "--toast-viewport-width": `${widthPx}px` } as CSSProperties;
}
 
export function toastScrimClass(slotClass?: string) {
  return cn(TOAST_SCRIM_BASE_CLASS, slotClass);
}
 