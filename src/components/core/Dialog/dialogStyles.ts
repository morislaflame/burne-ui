import { modalOverlayEnterStyle } from "@/components/core/utils/modalSurfaceMotion";

import type { ButtonSize } from "@/components/core/Button/buttonTypes";
import type { DialogSize, DialogSizePreset, DialogVariant } from "./dialogTypes";

import { cn } from "@/utils/cn";

export const DIALOG_CONTENT_CLASS =
  "flex min-h-0 flex-1 flex-col gap-large text-left";

const DIALOG_SECTION_PADDING_COMPACT = {
  headerPadding: "px-mid pt-base",
  bodyPadding: "px-mid py-small",
  footerPadding: "px-mid pb-base",
} as const;

const DIALOG_SECTION_PADDING_DEFAULT = {
  headerPadding: "px-large pt-mid",
  bodyPadding: "px-large py-small",
  footerPadding: "px-large pb-mid",
} as const;

export const DIALOG_SIZE: Record<DialogSize, DialogSizePreset> = {
  small: {
    panelMax: "max-w-component-small",
    maxHeight: "max-h-[min(85dvh,26rem)]",
    headerGap: "gap-base",
    ...DIALOG_SECTION_PADDING_COMPACT,
    headingBlockGap: "flex min-w-0 flex-1 flex-col gap-xsmall text-left",
    titleVariant: "base",
    descVariant: "small",
    descClassName: "text-muted",
    bodyVariant: "small",
  },
  base: {
    panelMax: "max-w-component-base",
    maxHeight: "max-h-[min(90dvh,36rem)]",
    headerGap: "gap-mid",
    ...DIALOG_SECTION_PADDING_DEFAULT,
    headingBlockGap: "flex min-w-0 flex-1 flex-col gap-base text-left",
    titleVariant: "mid",
    descVariant: "base",
    descClassName: "text-muted",
    bodyVariant: "base",
  },
  mid: {
    panelMax: "max-w-component-mid",
    maxHeight: "max-h-[min(90dvh,40rem)]",
    headerGap: "gap-mid",
    ...DIALOG_SECTION_PADDING_DEFAULT,
    headingBlockGap: "flex min-w-0 flex-1 flex-col gap-base text-left",
    titleVariant: "mid",
    descVariant: "base",
    descClassName: "text-muted",
    bodyVariant: "base",
  },
  large: {
    panelMax: "max-w-component-large",
    maxHeight: "max-h-[min(90dvh,44rem)]",
    headerGap: "gap-mid",
    ...DIALOG_SECTION_PADDING_DEFAULT,
    headingBlockGap: "flex min-w-0 flex-1 flex-col gap-base text-left",
    titleVariant: "mid",
    descVariant: "base",
    descClassName: "text-muted",
    bodyVariant: "mid",
  },
};

export const FOOTER_BUTTON_SIZE: Record<DialogSize, ButtonSize> = {
  small: "small",
  base: "base",
  mid: "base",
  large: "base",
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
  "flex min-h-0 flex-col overflow-hidden rounded-mid border-token bg-surface text-left text-foreground shadow-token-large";

export const DIALOG_GLOSS_PANEL_CLASS =
  "gloss-panel gloss-deep flex min-h-0 w-full flex-col rounded-mid text-foreground";

export const DIALOG_HEADER_CLASS = "flex shrink-0 items-start";

export const DIALOG_HEADING_BLOCK_CLASS = "min-w-0";

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
  sizePreset: Pick<DialogSizePreset, "panelMax" | "maxHeight">;
  className?: string;
  slotClass?: string;
}): string {
  const isGloss = variant === "gloss";
  return cn(
    DIALOG_PANEL_BASE_CLASS,
    sizePreset.panelMax,
    !isGloss && DIALOG_PANEL_SURFACE_CLASS,
    !isGloss && sizePreset.maxHeight,
    slotClass,
    className,
  );
}

export function dialogGlossPanelClass(maxHeight: string, slotClass?: string): string {
  return cn(DIALOG_GLOSS_PANEL_CLASS, maxHeight, slotClass);
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
  return FOOTER_BUTTON_SIZE[dialogSize];
}
