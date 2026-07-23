import { modalOverlayEnterStyle } from "@/components/core/utils/modalSurfaceMotion";

import type { DrawerExtent, DrawerPlacement, DrawerVariant } from "./drawerTypes";

import { cn } from "@/utils/cn";

const PANEL_PLACEMENT_CLASS: Record<DrawerPlacement, string> = {
  left: "left-0 top-0 h-full",
  right: "right-0 top-0 h-full",
  bottom: "bottom-0 inset-x-0 w-full",
  top: "top-0 inset-x-0 w-full",
};

type SizeEntry = { horizontal: string; vertical: string };

const PANEL_SIZE_CLASS: Record<DrawerExtent, SizeEntry> = {
  default: {
    horizontal: "max-w-[min(100vw,24rem)] w-full",
    vertical: "max-h-[90dvh]",
  },
  mid: {
    horizontal: "w-[50vw] max-w-full",
    vertical: "max-h-[50dvh]",
  },
  full: {
    horizontal: "w-screen",
    vertical: "h-dvh",
  },
};

const PANEL_ROUNDING_CLASS: Record<DrawerPlacement, string> = {
  left: "rounded-r-mid",
  right: "rounded-l-mid",
  bottom: "rounded-t-mid",
  top: "rounded-b-mid",
};

export const HANDLE_EDGE_PADDING_CLASS: Record<DrawerPlacement, string> = {
  bottom: "pt-plus",
  top: "pb-plus",
  left: "pr-plus",
  right: "pl-plus",
};

export const DRAWER_CONTENT_CLASS =
  "flex min-h-0 flex-1 flex-col gap-mid text-left";

export const DRAWER_HEADER_PADDING = "px-mid pt-plus";

export const DRAWER_BODY_PADDING = "px-mid py-base";

export const DRAWER_FOOTER_PADDING = "px-mid pb-plus";

export const DRAWER_NATIVE_CLASS =
  "m-0 h-full w-full max-h-none max-w-none border-0 bg-transparent p-0 open:block [&::backdrop]:bg-transparent";

export const DRAWER_NATIVE_POSITION_FIXED_CLASS = "fixed inset-0 z-[100]";

export const DRAWER_NATIVE_POSITION_CONTAINED_CLASS = "absolute inset-0 z-[100]";

export function drawerNativeClass(contained: boolean): string {
  return cn(
    contained
      ? DRAWER_NATIVE_POSITION_CONTAINED_CLASS
      : DRAWER_NATIVE_POSITION_FIXED_CLASS,
    DRAWER_NATIVE_CLASS,
  );
}

export const DRAWER_OVERLAY_LIGHT_CLASS =
  "bg-[color-mix(in_oklab,var(--color-foreground)_14%,transparent)] backdrop-blur-[14px] backdrop-saturate-150 motion-reduce:backdrop-blur-none";

export const DRAWER_OVERLAY_DARK_CLASS =
  "bg-[color-mix(in_oklab,black_55%,transparent)]";

export const DRAWER_PANEL_BASE_CLASS =
  "absolute z-10 flex flex-col outline-none overflow-hidden";

export const DRAWER_PANEL_SURFACE_CLASS =
  "border-token bg-surface text-foreground shadow-token-large";

export const DRAWER_GLOSS_PANEL_CLASS =
  "gloss-panel gloss-deep flex min-h-0 flex-1 flex-col text-foreground";

export const DRAWER_GLOSS_CONTENT_WRAP_CLASS =
  "gloss-content flex min-h-0 min-w-0 flex-1 flex-col";

export const DRAWER_HEADER_CLASS =
  "flex shrink-0 items-start gap-plus text-left";

export const DRAWER_HEADING_BLOCK_CLASS =
  "flex min-w-0 flex-1 flex-col gap-xsmall text-left";

export const DRAWER_TITLE_CLASS = "min-w-0";

export const DRAWER_DESCRIPTION_CLASS = "text-muted";

export const DRAWER_BODY_BASE_CLASS = "min-h-0 flex-1 overflow-y-auto";

export const DRAWER_FOOTER_CLASS =
  "flex shrink-0 flex-wrap items-center justify-end gap-base";

export const DRAWER_CLOSE_CLASS = "shrink-0";

export const DRAWER_TRIGGER_BASE_CLASS = "outline-none focus-ring";

export const DRAWER_HANDLE_BASE_CLASS =
  "flex touch-none select-none shrink-0 items-center justify-center cursor-grab active:cursor-grabbing box-content outline-none focus-ring";

export const DRAWER_HANDLE_GRIP_HORIZONTAL_CLASS = "h-1 w-10";

export const DRAWER_HANDLE_GRIP_VERTICAL_CLASS = "h-10 w-1";

export const DRAWER_HANDLE_GRIP_BASE_CLASS = "rounded-full bg-tertiary";

function panelSizeClass(placement: DrawerPlacement, size: DrawerExtent): string {
  const entry = PANEL_SIZE_CLASS[size];
  return placement === "left" || placement === "right"
    ? entry.horizontal
    : entry.vertical;
}

export function drawerOverlayEnterStyle() {
  return modalOverlayEnterStyle();
}

export function drawerOverlayClass({
  lightUi,
  dismissable,
  slotClass,
}: {
  lightUi: boolean;
  dismissable: boolean;
  slotClass?: string;
}): string {
  return cn(
    "absolute inset-0",
    lightUi ? DRAWER_OVERLAY_LIGHT_CLASS : DRAWER_OVERLAY_DARK_CLASS,
    dismissable ? "cursor-pointer" : "cursor-default",
    slotClass,
  );
}

export function drawerPanelClass({
  variant,
  placement,
  extent,
  className,
  slotClass,
}: {
  variant: DrawerVariant;
  placement: DrawerPlacement;
  extent: DrawerExtent;
  className?: string;
  slotClass?: string;
}): string {
  const rounding = extent !== "full" ? PANEL_ROUNDING_CLASS[placement] : undefined;

  return cn(
    DRAWER_PANEL_BASE_CLASS,
    variant !== "gloss" && DRAWER_PANEL_SURFACE_CLASS,
    PANEL_PLACEMENT_CLASS[placement],
    panelSizeClass(placement, extent),
    rounding,
    slotClass,
    className,
  );
}

export function drawerGlossPanelClass({
  placement,
  extent,
  slotClass,
}: {
  placement: DrawerPlacement;
  extent: DrawerExtent;
  slotClass?: string;
}): string {
  const rounding = extent !== "full" ? PANEL_ROUNDING_CLASS[placement] : undefined;

  return cn(
    DRAWER_GLOSS_PANEL_CLASS,
    rounding,
    slotClass,
  );
}

export function drawerContentClass(slotClass?: string): string {
  return cn(DRAWER_CONTENT_CLASS, slotClass);
}

export function drawerGlossContentWrapClass(slotClass?: string): string {
  return cn(DRAWER_GLOSS_CONTENT_WRAP_CLASS, slotClass);
}

export function drawerBodyClass(slotClass?: string): string {
  return cn(DRAWER_BODY_BASE_CLASS, DRAWER_BODY_PADDING, slotClass);
}

export function drawerHandleClass({
  placement,
  slotClass,
  className,
}: {
  placement: DrawerPlacement;
  slotClass?: string;
  className?: string;
}): string {
  const isHorizontal = placement === "left" || placement === "right";

  return cn(
    DRAWER_HANDLE_BASE_CLASS,
    isHorizontal ? "self-stretch w-xsmall" : "h-xsmall w-full",
    HANDLE_EDGE_PADDING_CLASS[placement],
    slotClass,
    className,
  );
}

export function drawerHandleGripClass({
  placement,
  slotClass,
}: {
  placement: DrawerPlacement;
  slotClass?: string;
}): string {
  const isHorizontal = placement === "left" || placement === "right";

  return cn(
    DRAWER_HANDLE_GRIP_BASE_CLASS,
    isHorizontal ? DRAWER_HANDLE_GRIP_VERTICAL_CLASS : DRAWER_HANDLE_GRIP_HORIZONTAL_CLASS,
    slotClass,
  );
}
