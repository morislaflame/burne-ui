import { modalOverlayEnterStyle } from "@/components/core/utils/modalSurfaceMotion";
import {
  PANEL_SIZE_LAYOUT,
  panelSizeLayout,
  type PanelSize,
} from "@/components/core/utils/sizeLayout";

import type { ButtonSize } from "@/components/core/Button/buttonTypes";
import type { DialogSize, DialogSizePreset, DialogVariant } from "./dialogTypes";

import { cn } from "@/utils/cn";

export const DIALOG_CONTENT_CLASS =
  "flex min-h-0 flex-1 flex-col text-left";

function toDialogSizePreset(size: PanelSize): DialogSizePreset {
  const panel = PANEL_SIZE_LAYOUT[size];
  return {
    rounded: panel.rounded,
    panelMax: panel.panelMax,
    maxHeight: panel.maxHeight,
    headerGap: panel.headerGap,
    headerPadding: panel.headerPadding,
    bodyPadding: panel.bodyPadding,
    footerPadding: panel.footerPadding,
    headingGap: panel.headingGap,
    titleVariant: panel.titleVariant,
    descVariant: panel.descVariant,
    descClassName: panel.descClassName,
    bodyVariant: panel.bodyVariant,
    footerButtonSize: panel.footerButtonSize,
    closeButtonSize: panel.closeButtonSize,
  };
}

export const DIALOG_SIZE: Record<DialogSize, DialogSizePreset> = {
  small: toDialogSizePreset("small"),
  base: toDialogSizePreset("base"),
  mid: toDialogSizePreset("mid"),
  large: toDialogSizePreset("large"),
};

export const DIALOG_NATIVE_CLASS =
  "m-0 flex h-full w-full max-h-none max-w-none items-center justify-center border-0 bg-transparent p-large open:flex [&::backdrop]:bg-transparent";

export const DIALOG_NATIVE_POSITION_FIXED_CLASS = "fixed inset-0 z-dialog";

export const DIALOG_NATIVE_POSITION_CONTAINED_CLASS = "absolute inset-0 z-dialog";

export function dialogNativeClass(contained: boolean): string {
  return cn(
    contained
      ? DIALOG_NATIVE_POSITION_CONTAINED_CLASS
      : DIALOG_NATIVE_POSITION_FIXED_CLASS,
    DIALOG_NATIVE_CLASS,
  );
}

export const DIALOG_OVERLAY_LIGHT_CLASS = "overlay-backdrop";

export const DIALOG_OVERLAY_DARK_CLASS = "overlay-backdrop-scrim";

export const DIALOG_PANEL_BASE_CLASS =
  "relative z-10 w-full outline-none";

export const DIALOG_PANEL_SURFACE_CLASS =
  "flex min-h-0 flex-col overflow-hidden border-token bg-surface text-left text-foreground shadow-token-large";

export const DIALOG_GLOSS_PANEL_CLASS =
  "gloss-panel gloss-deep flex min-h-0 w-full flex-col text-foreground";

export const DIALOG_HEADER_CLASS = "flex shrink-0 items-start";

export const DIALOG_HEADING_BLOCK_CLASS =
  "flex min-w-0 flex-1 flex-col text-left";

export const DIALOG_TITLE_CLASS = "min-w-0";

export const DIALOG_BODY_BASE_CLASS =
  "min-h-0 flex-1 overflow-y-auto py-small";

export const DIALOG_FOOTER_CLASS =
  "flex shrink-0 flex-wrap items-center justify-end gap-base";

export const DIALOG_CLOSE_CLASS = "shrink-0";

export const DIALOG_TRIGGER_BASE_CLASS = "outline-none focus-ring";

export const DIALOG_GLOSS_CONTENT_CLASS = "gloss-content";

export function dialogOverlayEnterStyle() {
  return modalOverlayEnterStyle();
}

export function dialogOverlayClass(lightUi: boolean, slotClass?: string): string {
  return cn(
    "absolute inset-0",
    lightUi ? DIALOG_OVERLAY_LIGHT_CLASS : DIALOG_OVERLAY_DARK_CLASS,
    slotClass,
  );
}

export function dialogPanelClass({
  variant,
  sizePreset,
  className,
  slotClass,
}: {
  variant: DialogVariant;
  sizePreset: Pick<DialogSizePreset, "panelMax" | "maxHeight" | "rounded">;
  className?: string;
  slotClass?: string;
}): string {
  const isGloss = variant === "gloss";
  return cn(
    DIALOG_PANEL_BASE_CLASS,
    sizePreset.panelMax,
    sizePreset.rounded,
    !isGloss && DIALOG_PANEL_SURFACE_CLASS,
    !isGloss && sizePreset.maxHeight,
    slotClass,
    className,
  );
}

export function dialogGlossPanelClass({
  maxHeight,
  rounded,
  slotClass,
}: {
  maxHeight: string;
  rounded: string;
  slotClass?: string;
}): string {
  return cn(DIALOG_GLOSS_PANEL_CLASS, rounded, maxHeight, slotClass);
}

export function dialogContentClass(slotClass?: string, gloss = false): string {
  return cn(
    DIALOG_CONTENT_CLASS,
    gloss && DIALOG_GLOSS_CONTENT_CLASS,
    slotClass,
  );
}

export function dialogBodyClass(bodyPadding: string, slotClass?: string): string {
  return cn(DIALOG_BODY_BASE_CLASS, bodyPadding, slotClass);
}

export function footerButtonSizeForDialog(dialogSize: DialogSize): ButtonSize {
  return panelSizeLayout(dialogSize).footerButtonSize;
}

export function closeButtonSizeForDialog(dialogSize: DialogSize): ButtonSize {
  return panelSizeLayout(dialogSize).closeButtonSize;
}
