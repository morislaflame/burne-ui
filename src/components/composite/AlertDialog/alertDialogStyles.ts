import { alertSurfaceClass, alertIndicatorWrapperTextClass } from "@/components/core/Alert/alertStyles";
import type { AlertStatus, AlertVariant } from "@/components/core/Alert/alertTypes";
import { dialogOverlayClass, dialogOverlayEnterStyle } from "@/components/core/Dialog/dialogStyles";
import { cn } from "@/utils/cn";

import type { AlertDialogSize, AlertDialogSizePreset } from "./alertDialogTypes";
import type { ButtonSize } from "@/components/core/Button/buttonTypes";

export const ALERT_DIALOG_CONTENT_CLASS =
  "flex min-h-0 flex-1 flex-col gap-mid text-left";

const ALERT_DIALOG_SECTION_PADDING_COMPACT = {
  headerPadding: "px-plus pt-base",
  bodyPadding: "px-plus py-small",
  footerPadding: "px-plus pb-base",
} as const;

const ALERT_DIALOG_SECTION_PADDING_DEFAULT = {
  headerPadding: "px-mid pt-plus",
  bodyPadding: "px-mid py-small",
  footerPadding: "px-mid pb-plus",
} as const;

export const ALERT_DIALOG_SIZE: Record<AlertDialogSize, AlertDialogSizePreset> = {
  small: {
    panelMax: "max-w-component-small",
    maxHeight: "max-h-[min(85dvh,26rem)]",
    headerGap: "gap-x-base",
    ...ALERT_DIALOG_SECTION_PADDING_COMPACT,
    headingBlockGap: "flex min-w-0 flex-col gap-xsmall",
    iconClass: "icon-mid",
    titleVariant: "base",
    descVariant: "small",
    descClassName: "text-muted",
    bodyVariant: "small",
  },
  base: {
    panelMax: "max-w-component-base",
    maxHeight: "max-h-[min(90dvh,36rem)]",
    headerGap: "gap-x-plus gap-y-xsmall",
    ...ALERT_DIALOG_SECTION_PADDING_DEFAULT,
    headingBlockGap: "flex min-w-0 flex-col gap-base",
    iconClass: "icon-large",
    titleVariant: "mid",
    descVariant: "base",
    descClassName: "text-muted",
    bodyVariant: "base",
  },
  mid: {
    panelMax: "max-w-component-mid",
    maxHeight: "max-h-[min(90dvh,40rem)]",
    headerGap: "gap-x-plus gap-y-small",
    ...ALERT_DIALOG_SECTION_PADDING_DEFAULT,
    headingBlockGap: "flex min-w-0 flex-col gap-base",
    iconClass: "icon-large",
    titleVariant: "mid",
    descVariant: "base",
    descClassName: "text-muted",
    bodyVariant: "base",
  },
  large: {
    panelMax: "max-w-component-large",
    maxHeight: "max-h-[min(90dvh,44rem)]",
    headerGap: "gap-x-plus gap-y-small",
    ...ALERT_DIALOG_SECTION_PADDING_DEFAULT,
    headingBlockGap: "flex min-w-0 flex-col gap-base",
    iconClass: "icon-large",
    titleVariant: "mid",
    descVariant: "base",
    descClassName: "text-muted",
    bodyVariant: "mid",
  },
};

export const FOOTER_BUTTON_SIZE: Record<AlertDialogSize, ButtonSize> = {
  small: "small",
  base: "base",
  mid: "base",
  large: "base",
};

export const ALERT_DIALOG_NATIVE_CLASS =
  "fixed inset-0 z-[100] m-0 flex h-full w-full max-h-none max-w-none items-center justify-center border-0 bg-transparent p-mid open:flex [&::backdrop]:bg-transparent";

export const ALERT_DIALOG_PANEL_SHELL_CLASS = "relative z-10 w-full outline-none";

export const ALERT_DIALOG_PANEL_SURFACE_CLASS =
  "flex min-h-0 flex-col overflow-hidden rounded-mid text-left";

export const ALERT_DIALOG_GLOSS_PANEL_CLASS =
  "gloss-panel gloss-deep flex min-h-0 w-full flex-col rounded-mid text-left text-foreground";

export const ALERT_DIALOG_GLOSS_CONTENT_CLASS = "gloss-content";

export const ALERT_DIALOG_CLOSE_CLASS = "shrink-0";

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
  sizePreset: Pick<AlertDialogSizePreset, "panelMax" | "maxHeight">;
  className?: string;
  slotClass?: string;
}): string {
  const isGloss = variant === "gloss";
  return cn(
    ALERT_DIALOG_PANEL_SHELL_CLASS,
    sizePreset.panelMax,
    !isGloss && ALERT_DIALOG_PANEL_SURFACE_CLASS,
    !isGloss && sizePreset.maxHeight,
    !isGloss && alertDialogPanelSurfaceClass(variant),
    slotClass,
    className,
  );
}

export function alertDialogGlossPanelClass(maxHeight: string, slotClass?: string): string {
  return cn(ALERT_DIALOG_GLOSS_PANEL_CLASS, maxHeight, slotClass);
}

export function alertDialogHeaderIconWrapperClass(status: AlertStatus): string {
  return alertIndicatorWrapperTextClass(status);
}

export function footerButtonSizeForAlertDialog(
  dialogSize: AlertDialogSize,
): ButtonSize {
  return FOOTER_BUTTON_SIZE[dialogSize];
}
