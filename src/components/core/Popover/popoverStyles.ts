import type { TextVariant } from "@/components/core/Text";
import { GLOSS_INTERACTIVE_MOTION_CLASS } from "@/components/core/utils/glossInteractiveMotion";
import {
  panelSizeLayout,
} from "@/components/core/utils/sizeLayout";
import { TOOLTIP_ARROW_SHELL_PAD } from "@/components/core/Tooltip/tooltipPosition";

import type {
  PopoverContentGap,
  PopoverSide,
  PopoverSize,
} from "./popoverTypes";

import { cn } from "@/utils/cn";

export const POPOVER_DEFAULT_OFFSET = 6;

/** Popover title scale — lighter than Dialog `titleVariant` (compact overlay). */
export const POPOVER_TITLE_VARIANT: Record<PopoverSize, TextVariant> = {
  small: "small",
  base: "base",
  mid: "mid",
  large: "large",
};

/** Description one step below title so header hierarchy stays readable. */
export const POPOVER_DESCRIPTION_VARIANT: Record<PopoverSize, TextVariant> = {
  small: "xsmall",
  base: "small",
  mid: "base",
  large: "base",
};

export const POPOVER_GAP_CLASS: Record<PopoverContentGap, string> = {
  small: "gap-small",
  base: "gap-base",
  mid: "gap-mid",
  large: "gap-large",
};

export const POPOVER_TRIGGER_CLASS =
  "inline-flex shrink-0 border-0 bg-transparent p-0 outline-none focus-ring";

export const POPOVER_CONTENT_CLASS =
  "pointer-events-auto z-popover w-max min-w-0 overflow-visible text-left outline-none will-change-transform";

export const POPOVER_PANEL_RELATIVE_CLASS = "relative overflow-visible";

export const POPOVER_GLOSS_PANEL_CLASS =
  "gloss-panel gloss-deep relative z-[1] flex min-w-0 origin-center flex-col overflow-hidden text-foreground";

export const POPOVER_GLOSS_CONTENT_CLASS =
  "gloss-content flex min-w-0 flex-col";

export const POPOVER_DEFAULT_PANEL_CLASS =
  "relative z-[1] flex min-w-0 flex-col overflow-hidden border-token bg-surface text-foreground animate-shadow";

export const POPOVER_ARROW_BASE_CLASS =
  "pointer-events-none absolute z-0 size-2 rotate-45";

export const POPOVER_ARROW_GLOSS_CLASS =
  "border-0 bg-[var(--color-surface)]";

export const POPOVER_ARROW_DEFAULT_CLASS = "border-token bg-surface";

export const POPOVER_HEADER_CLASS =
  "flex shrink-0 flex-col text-left";

export const POPOVER_LABEL_CLASS = "min-w-0 font-w-mid";

export const POPOVER_BODY_CLASS = "min-h-0 min-w-0 text-left";

function resolvePopoverGapClass(
  size: PopoverSize,
  contentGap: PopoverContentGap,
  gapPropSet: boolean,
): string {
  // Explicit `gap` prop → size-key map; default → panel `contentGap` token.
  return gapPropSet ? POPOVER_GAP_CLASS[contentGap] : panelSizeLayout(size).contentGap;
}

function popoverSizedPanelClasses({
  size,
  unstyled,
  contentGap,
  gapPropSet,
}: {
  size: PopoverSize;
  unstyled: boolean;
  contentGap: PopoverContentGap;
  gapPropSet: boolean;
}): string | false {
  const panel = panelSizeLayout(size);
  // `unstyled` skips padding/gap/minmax — surface (border/bg) stays on the shell.
  // Always keep size radius so overflow-hidden + border don't square the corners
  // (Dropdown / Select / ComboBox / ColorPicker use unstyled + own padding).
  if (unstyled) return panel.rounded;
  return cn(
    panel.rounded,
    panel.panelMin,
    panel.popoverMax,
    panel.contentPadding,
    resolvePopoverGapClass(size, contentGap, gapPropSet),
  );
}

export function popoverTriggerClass({
  rootSlot,
  slotClass,
  className,
}: {
  rootSlot?: string;
  slotClass?: string;
  className?: string;
}): string {
  return cn(POPOVER_TRIGGER_CLASS, rootSlot, slotClass, className);
}

export function popoverContentClass({
  resolvedSide,
  showArrow,
  slotClass,
  className,
}: {
  resolvedSide: PopoverSide;
  showArrow: boolean;
  slotClass?: string;
  className?: string;
}): string {
  return cn(
    POPOVER_CONTENT_CLASS,
    showArrow && TOOLTIP_ARROW_SHELL_PAD[resolvedSide],
    slotClass,
    className,
  );
}

export function popoverGlossPanelClass({
  size,
  unstyled,
  slotClass,
}: {
  size: PopoverSize;
  unstyled: boolean;
  slotClass?: string;
}): string {
  const panel = panelSizeLayout(size);
  return cn(
    POPOVER_GLOSS_PANEL_CLASS,
    GLOSS_INTERACTIVE_MOTION_CLASS,
    // Gap lives on gloss content (Header/Body siblings) — not on this shell.
    unstyled
      ? panel.rounded
      : cn(panel.rounded, panel.panelMin, panel.popoverMax, panel.contentPadding),
    slotClass,
  );
}

export function popoverGlossContentClass({
  size,
  unstyled,
  contentGap,
  gapPropSet,
  slotClass,
}: {
  size: PopoverSize;
  unstyled: boolean;
  contentGap: PopoverContentGap;
  gapPropSet: boolean;
  slotClass?: string;
}): string {
  return cn(
    POPOVER_GLOSS_CONTENT_CLASS,
    !unstyled && resolvePopoverGapClass(size, contentGap, gapPropSet),
    slotClass,
  );
}

export function popoverDefaultPanelClass({
  size,
  unstyled,
  contentGap,
  gapPropSet,
  slotClass,
}: {
  size: PopoverSize;
  unstyled: boolean;
  contentGap: PopoverContentGap;
  gapPropSet: boolean;
  slotClass?: string;
}): string {
  return cn(
    POPOVER_DEFAULT_PANEL_CLASS,
    popoverSizedPanelClasses({ size, unstyled, contentGap, gapPropSet }),
    slotClass,
  );
}

export function popoverArrowClass({
  isGloss,
  arrowSideClass,
  slotClass,
  className,
}: {
  isGloss: boolean;
  resolvedSide: PopoverSide;
  arrowSideClass: string;
  slotClass?: string;
  className?: string;
}): string {
  return cn(
    POPOVER_ARROW_BASE_CLASS,
    isGloss ? POPOVER_ARROW_GLOSS_CLASS : POPOVER_ARROW_DEFAULT_CLASS,
    arrowSideClass,
    slotClass,
    className,
  );
}

export function popoverHeaderClass({
  size,
  slotClass,
  className,
}: {
  size: PopoverSize;
  slotClass?: string;
  className?: string;
}): string {
  return cn(
    POPOVER_HEADER_CLASS,
    panelSizeLayout(size).headingGap,
    slotClass,
    className,
  );
}

export function popoverTitleClass({
  slotClass,
  className,
}: {
  slotClass?: string;
  className?: string;
}): string {
  return cn(POPOVER_LABEL_CLASS, slotClass, className);
}

export function popoverBodyClass({
  slotClass,
  className,
}: {
  slotClass?: string;
  className?: string;
}): string {
  return cn(POPOVER_BODY_CLASS, slotClass, className);
}

export function popoverTitleVariant(size: PopoverSize): TextVariant {
  return POPOVER_TITLE_VARIANT[size];
}

export function popoverDescriptionVariant(size: PopoverSize): TextVariant {
  return POPOVER_DESCRIPTION_VARIANT[size];
}

/** Default content gap matches panel size step (`small`→`large`). */
export function popoverDefaultContentGap(size: PopoverSize): PopoverContentGap {
  return size;
}
