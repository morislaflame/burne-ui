import { modalOverlayEnterStyle } from "@/components/core/utils/modalSurfaceMotion";
import {
  PANEL_SIZE_LAYOUT,
  panelSizeLayout,
  type PanelSize,
} from "@/components/core/utils/sizeLayout";

import type { ButtonSize } from "@/components/core/Button/buttonTypes";
import type {
  DrawerExtent,
  DrawerPlacement,
  DrawerSize,
  DrawerSizePreset,
  DrawerVariant,
} from "./drawerTypes";

import { cn } from "@/utils/cn";

const PANEL_PLACEMENT_CLASS: Record<DrawerPlacement, string> = {
  left: "left-0 top-0 h-full",
  right: "right-0 top-0 h-full",
  bottom: "bottom-0 inset-x-0 w-full",
  top: "top-0 inset-x-0 w-full",
};

type SizeEntry = { horizontal: string; vertical: string };

/** Viewport extent — orthogonal to chrome `PANEL_SIZE_LAYOUT`. */
const DRAWER_EXTENT_CLASS: Record<DrawerExtent, SizeEntry> = {
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

/** Edge radius by chrome size (Tailwind needs full class strings). */
const DRAWER_EDGE_ROUNDED: Record<
  PanelSize,
  Record<DrawerPlacement, string>
> = {
  small: {
    left: "rounded-r-small",
    right: "rounded-l-small",
    bottom: "rounded-t-small",
    top: "rounded-b-small",
  },
  base: {
    left: "rounded-r-base",
    right: "rounded-l-base",
    bottom: "rounded-t-base",
    top: "rounded-b-base",
  },
  mid: {
    left: "rounded-r-mid",
    right: "rounded-l-mid",
    bottom: "rounded-t-mid",
    top: "rounded-b-mid",
  },
  large: {
    left: "rounded-r-large",
    right: "rounded-l-large",
    bottom: "rounded-t-large",
    top: "rounded-b-large",
  },
};

export const HANDLE_EDGE_PADDING_CLASS: Record<DrawerPlacement, string> = {
  bottom: "pt-mid",
  top: "pb-mid",
  left: "pr-mid",
  right: "pl-mid",
};

function toDrawerSizePreset(size: PanelSize): DrawerSizePreset {
  const panel = PANEL_SIZE_LAYOUT[size];
  return {
    rounded: panel.rounded,
    headerGap: panel.headerGap,
    headerPadding: panel.headerPadding,
    bodyPadding: panel.bodyPadding,
    footerPadding: panel.footerPadding,
    headingGap: panel.headingGap,
    titleVariant: panel.titleVariant,
    titleClassName: panel.titleClassName,
    descVariant: panel.descVariant,
    descClassName: panel.descClassName,
    bodyVariant: panel.bodyVariant,
    footerButtonSize: panel.footerButtonSize,
    closeButtonSize: panel.closeButtonSize,
  };
}

export const DRAWER_SIZE: Record<DrawerSize, DrawerSizePreset> = {
  small: toDrawerSizePreset("small"),
  base: toDrawerSizePreset("base"),
  mid: toDrawerSizePreset("mid"),
  large: toDrawerSizePreset("large"),
};

export const DRAWER_CONTENT_CLASS =
  "flex min-h-0 flex-1 flex-col text-left";

export const DRAWER_NATIVE_CLASS =
  "m-0 h-full w-full max-h-none max-w-none border-0 bg-transparent p-0 open:block [&::backdrop]:bg-transparent";

export const DRAWER_NATIVE_POSITION_FIXED_CLASS = "fixed inset-0 z-dialog";

export const DRAWER_NATIVE_POSITION_CONTAINED_CLASS = "absolute inset-0 z-dialog";

export function drawerNativeClass(contained: boolean): string {
  return cn(
    contained
      ? DRAWER_NATIVE_POSITION_CONTAINED_CLASS
      : DRAWER_NATIVE_POSITION_FIXED_CLASS,
    DRAWER_NATIVE_CLASS,
  );
}

export const DRAWER_OVERLAY_LIGHT_CLASS = "overlay-backdrop";

export const DRAWER_OVERLAY_DARK_CLASS = "overlay-backdrop-scrim";

export const DRAWER_PANEL_BASE_CLASS =
  "absolute z-10 flex flex-col outline-none overflow-hidden";

export const DRAWER_PANEL_SURFACE_CLASS =
  "border-token bg-surface text-foreground shadow-token-large";

export const DRAWER_GLOSS_PANEL_CLASS =
  "gloss-panel gloss-deep flex min-h-0 flex-1 flex-col text-foreground";

export const DRAWER_GLOSS_CONTENT_WRAP_CLASS =
  "gloss-content flex min-h-0 min-w-0 flex-1 flex-col";

export const DRAWER_HEADER_CLASS = "flex shrink-0 items-start text-left";

export const DRAWER_HEADING_BLOCK_CLASS =
  "flex min-w-0 flex-1 flex-col text-left";

export const DRAWER_TITLE_CLASS = "min-w-0";

export const DRAWER_BODY_BASE_CLASS = "min-h-0 flex-1 overflow-y-auto";

export const DRAWER_FOOTER_CLASS =
  "flex shrink-0 flex-wrap items-center justify-end gap-base";

export const DRAWER_CLOSE_CLASS = "shrink-0";

export const DRAWER_TRIGGER_BASE_CLASS = "outline-none focus-ring";

export const DRAWER_HANDLE_BASE_CLASS =
  "flex touch-none select-none shrink-0 items-center justify-center cursor-grab active:cursor-grabbing box-content";

export const DRAWER_HANDLE_GRIP_HORIZONTAL_CLASS = "h-1 w-10";

export const DRAWER_HANDLE_GRIP_VERTICAL_CLASS = "h-10 w-1";

export const DRAWER_HANDLE_GRIP_BASE_CLASS =
  "rounded-full bg-tertiary outline-none focus-ring";

function drawerExtentClass(
  placement: DrawerPlacement,
  extent: DrawerExtent,
): string {
  const entry = DRAWER_EXTENT_CLASS[extent];
  return placement === "left" || placement === "right"
    ? entry.horizontal
    : entry.vertical;
}

function drawerEdgeRoundedClass(
  placement: DrawerPlacement,
  size: DrawerSize,
  extent: DrawerExtent,
): string | undefined {
  if (extent === "full") return undefined;
  return DRAWER_EDGE_ROUNDED[size][placement];
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
  size,
  className,
  slotClass,
}: {
  variant: DrawerVariant;
  placement: DrawerPlacement;
  extent: DrawerExtent;
  size: DrawerSize;
  className?: string;
  slotClass?: string;
}): string {
  return cn(
    DRAWER_PANEL_BASE_CLASS,
    variant !== "gloss" && DRAWER_PANEL_SURFACE_CLASS,
    PANEL_PLACEMENT_CLASS[placement],
    drawerExtentClass(placement, extent),
    drawerEdgeRoundedClass(placement, size, extent),
    slotClass,
    className,
  );
}

export function drawerGlossPanelClass({
  placement,
  extent,
  size,
  slotClass,
}: {
  placement: DrawerPlacement;
  extent: DrawerExtent;
  size: DrawerSize;
  slotClass?: string;
}): string {
  return cn(
    DRAWER_GLOSS_PANEL_CLASS,
    drawerEdgeRoundedClass(placement, size, extent),
    slotClass,
  );
}

export function drawerContentClass(slotClass?: string): string {
  return cn(DRAWER_CONTENT_CLASS, slotClass);
}

export function drawerGlossContentWrapClass(slotClass?: string): string {
  return cn(DRAWER_GLOSS_CONTENT_WRAP_CLASS, slotClass);
}

export function drawerBodyClass(bodyPadding: string, slotClass?: string): string {
  return cn(DRAWER_BODY_BASE_CLASS, bodyPadding, slotClass);
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

export function footerButtonSizeForDrawer(drawerSize: DrawerSize): ButtonSize {
  return panelSizeLayout(drawerSize).footerButtonSize;
}

export function closeButtonSizeForDrawer(drawerSize: DrawerSize): ButtonSize {
  return panelSizeLayout(drawerSize).closeButtonSize;
}
