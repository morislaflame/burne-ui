import { alertSurfaceClass, alertIndicatorWrapperTextClass } from "@/components/core/Alert/alertStyles";
import type { AlertStatus, AlertVariant } from "@/components/core/Alert/alertTypes";
import { dialogOverlayClass, dialogOverlayEnterStyle } from "@/components/core/Dialog/dialogStyles";
import {
  PANEL_SIZE_LAYOUT,
  panelSizeLayout,
  type PanelSize,
} from "@/components/core/utils/sizeLayout";
import { cn } from "@/utils/cn";

import type { AlertDialogSize, AlertDialogSizePreset } from "./alertDialogTypes";
import type { ButtonSize } from "@/components/core/Button/buttonTypes";

export const ALERT_DIALOG_CONTENT_CLASS =
  "flex min-h-0 flex-1 flex-col text-left";

function toAlertDialogSizePreset(size: PanelSize): AlertDialogSizePreset {
  const panel = PANEL_SIZE_LAYOUT[size];
  return {
    rounded: panel.rounded,
    panelMax: panel.panelMax,
    maxHeight: panel.maxHeight,
    headerGap: panel.alertHeaderGap,
    headerPadding: panel.headerPadding,
    bodyPadding: panel.bodyPadding,
    footerPadding: panel.footerPadding,
    iconClass: panel.iconClass,
    titleVariant: panel.alertTitleVariant,
    descVariant: panel.descVariant,
    descClassName: panel.descClassName,
    bodyVariant: panel.bodyVariant,
    footerButtonSize: panel.footerButtonSize,
    closeButtonSize: panel.closeButtonSize,
  };
}

export const ALERT_DIALOG_SIZE: Record<AlertDialogSize, AlertDialogSizePreset> = {
  small: toAlertDialogSizePreset("small"),
  base: toAlertDialogSizePreset("base"),
  mid: toAlertDialogSizePreset("mid"),
  large: toAlertDialogSizePreset("large"),
};

export const ALERT_DIALOG_NATIVE_CLASS =
  "m-0 flex h-full w-full max-h-none max-w-none items-center justify-center border-0 bg-transparent p-large open:flex [&::backdrop]:bg-transparent";

export const ALERT_DIALOG_NATIVE_POSITION_FIXED_CLASS = "fixed inset-0 z-dialog";

export const ALERT_DIALOG_NATIVE_POSITION_CONTAINED_CLASS =
  "absolute inset-0 z-dialog";

export function alertDialogNativeClass(contained: boolean): string {
  return cn(
    contained
      ? ALERT_DIALOG_NATIVE_POSITION_CONTAINED_CLASS
      : ALERT_DIALOG_NATIVE_POSITION_FIXED_CLASS,
    ALERT_DIALOG_NATIVE_CLASS,
  );
}

export const ALERT_DIALOG_PANEL_SHELL_CLASS = "relative z-10 w-full outline-none";

export const ALERT_DIALOG_PANEL_SURFACE_CLASS =
  "flex min-h-0 flex-col overflow-hidden text-left";

export const ALERT_DIALOG_GLOSS_PANEL_CLASS =
  "gloss-panel gloss-deep flex min-h-0 w-full flex-col text-left text-foreground";

export const ALERT_DIALOG_GLOSS_CONTENT_CLASS = "gloss-content";

export const ALERT_DIALOG_CLOSE_CLASS = "shrink-0";

export const ALERT_DIALOG_TRIGGER_BASE_CLASS = "outline-none focus-ring";

export const ALERT_DIALOG_INDICATOR_CLASS = "shrink-0 [&_svg]:block";

export const ALERT_DIALOG_HEADER_CLASS = "shrink-0";

export const ALERT_DIALOG_HEADING_BLOCK_CLASS = "contents";

export const ALERT_DIALOG_TITLE_CLASS = "font-w-mid";

export const ALERT_DIALOG_BODY_BASE_CLASS =
  "min-h-0 flex-1 overflow-y-auto py-small";

export const ALERT_DIALOG_FOOTER_CLASS =
  "flex shrink-0 flex-wrap items-center justify-end gap-base";

export function alertDialogPanelSurfaceClass(variant: AlertVariant): string {
  // Panel surface follows variant only; status colors icon/text in the header, not the shell.
  return cn(alertSurfaceClass(variant, "default"), "shadow-token-large");
}

export function alertDialogOverlayClass(lightUi: boolean, slotClass?: string): string {
  return dialogOverlayClass(lightUi, slotClass);
}

export function alertDialogOverlayEnterStyle() {
  return dialogOverlayEnterStyle();
}

export function alertDialogBodyClass(bodyPadding: string, className?: string): string {
  return cn(
    ALERT_DIALOG_BODY_BASE_CLASS,
    bodyPadding,
    "text-left",
    className,
  );
}

export function alertDialogContentClass(className?: string): string {
  return cn(ALERT_DIALOG_CONTENT_CLASS, className);
}

export function alertDialogPanelClass({
  variant,
  sizePreset,
  className,
  slotClass,
}: {
  variant: AlertVariant;
  sizePreset: Pick<AlertDialogSizePreset, "panelMax" | "maxHeight" | "rounded">;
  className?: string;
  slotClass?: string;
}): string {
  const isGloss = variant === "gloss";
  return cn(
    ALERT_DIALOG_PANEL_SHELL_CLASS,
    sizePreset.panelMax,
    sizePreset.rounded,
    !isGloss && ALERT_DIALOG_PANEL_SURFACE_CLASS,
    !isGloss && sizePreset.maxHeight,
    !isGloss && alertDialogPanelSurfaceClass(variant),
    slotClass,
    className,
  );
}

export function alertDialogGlossPanelClass({
  maxHeight,
  rounded,
  slotClass,
}: {
  maxHeight: string;
  rounded: string;
  slotClass?: string;
}): string {
  return cn(ALERT_DIALOG_GLOSS_PANEL_CLASS, rounded, maxHeight, slotClass);
}

export function alertDialogHeaderIconWrapperClass(status: AlertStatus): string {
  return alertIndicatorWrapperTextClass(status);
}

export function footerButtonSizeForAlertDialog(
  dialogSize: AlertDialogSize,
): ButtonSize {
  return panelSizeLayout(dialogSize).footerButtonSize;
}

export function closeButtonSizeForAlertDialog(
  dialogSize: AlertDialogSize,
): ButtonSize {
  return panelSizeLayout(dialogSize).closeButtonSize;
}
