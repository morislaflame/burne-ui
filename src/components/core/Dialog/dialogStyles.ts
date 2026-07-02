import {
  MODAL_BODY_SCROLL_CLASS,
  MODAL_CONTENT_CLASS,
} from "@/components/core/utils/modalPanelLayout";
import { modalOverlayEnterStyle } from "@/components/core/utils/modalSurfaceMotion";

import { mergeDialogSlotClass } from "./dialogAPI";
import type { DialogVariant } from "./dialogTypes";

export const DIALOG_NATIVE_CLASS =
  "fixed inset-0 z-[100] m-0 flex h-full w-full max-h-none max-w-none items-center justify-center border-0 bg-transparent p-mid open:flex [&::backdrop]:bg-transparent";

export const DIALOG_OVERLAY_LIGHT_CLASS =
  "bg-[color-mix(in_oklab,var(--color-foreground)_14%,transparent)] backdrop-blur-[14px] backdrop-saturate-150 motion-reduce:backdrop-blur-none";

export const DIALOG_OVERLAY_DARK_CLASS =
  "bg-[color-mix(in_oklab,black_58%,transparent)]";

export const DIALOG_PANEL_BASE_CLASS =
  "relative z-10 w-full max-w-component-mid outline-none";

export const DIALOG_PANEL_SURFACE_CLASS =
  "flex min-h-0 max-h-[min(90dvh,36rem)] flex-col overflow-hidden rounded-mid border-token bg-surface text-left text-foreground shadow-token-large";

export const DIALOG_GLOSS_PANEL_CLASS =
  "gloss-panel gloss-deep flex min-h-0 max-h-[min(90dvh,36rem)] w-full flex-col rounded-mid text-foreground";

export const DIALOG_HEADER_CLASS = "flex shrink-0 items-start gap-plus";

export const DIALOG_HEADING_BLOCK_CLASS =
  "flex min-w-0 flex-1 flex-col gap-xsmall text-left";

export const DIALOG_TITLE_CLASS = "min-w-0";

export const DIALOG_DESCRIPTION_CLASS = "text-muted";

export const DIALOG_FOOTER_CLASS =
  "flex shrink-0 flex-wrap items-center justify-end gap-base";

export const DIALOG_CLOSE_CLASS = "shrink-0";

export const DIALOG_GLOSS_CONTENT_CLASS = "gloss-content";

export function dialogOverlayEnterStyle() {
  return modalOverlayEnterStyle();
}

export function dialogOverlayClass(lightUi: boolean, slotClass?: string): string {
  return mergeDialogSlotClass(
    "absolute inset-0",
    lightUi ? DIALOG_OVERLAY_LIGHT_CLASS : DIALOG_OVERLAY_DARK_CLASS,
    slotClass,
  );
}

export function dialogPanelClass({
  variant,
  className,
  slotClass,
}: {
  variant: DialogVariant;
  className?: string;
  slotClass?: string;
}): string {
  return mergeDialogSlotClass(
    DIALOG_PANEL_BASE_CLASS,
    variant !== "gloss" && DIALOG_PANEL_SURFACE_CLASS,
    className,
    slotClass,
  );
}

export function dialogContentClass(slotClass?: string, gloss = false): string {
  return mergeDialogSlotClass(
    MODAL_CONTENT_CLASS,
    gloss && DIALOG_GLOSS_CONTENT_CLASS,
    slotClass,
  );
}

export function dialogBodyClass(slotClass?: string): string {
  return mergeDialogSlotClass(MODAL_BODY_SCROLL_CLASS, slotClass);
}

export {
  MODAL_CONTENT_CLASS,
  MODAL_BODY_SCROLL_CLASS,
};
