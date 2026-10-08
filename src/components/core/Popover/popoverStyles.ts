import type { TextVariant } from "@/components/core/Text";
import {
  panelSizeLayout,
} from "@/components/core/utils/sizeLayout";
import { TOOLTIP_ARROW_SHELL_PAD } from "@/components/core/Tooltip/tooltipPosition";
import { resolveVariantVisual } from "@/skins/resolveVariantVisual";

import type {
  PopoverContentGap,
  PopoverSide,
  PopoverSize,
  PopoverVariant,
} from "./popoverTypes";
import { KIT_POPOVER_VARIANTS } from "./popoverTypes";

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
  "pointer-events-auto z-popover w-max min-w-0 overflow-visible text-start outline-none";

export const POPOVER_PANEL_RELATIVE_CLASS = "relative overflow-visible";

export const POPOVER_PANEL_BASE_CLASS =
  "relative z-[1] flex min-w-0 flex-col overflow-hidden text-foreground";

export const POPOVER_PANEL_SURFACE_CLASS =
  "border-token bg-surface shadow-token-large";

export const POPOVER_ARROW_BASE_CLASS =
  "pointer-events-none absolute z-0 size-2 rotate-45";

export const POPOVER_ARROW_DEFAULT_CLASS = "border-token bg-surface";

export const POPOVER_HEADER_CLASS =
  "flex shrink-0 flex-col text-start";

export const POPOVER_LABEL_CLASS = "min-w-0 font-w-mid";

export const POPOVER_BODY_CLASS = "min-h-0 min-w-0 text-start";

function resolvePopoverGapClass(
  contentGap: PopoverContentGap,
  gapPropSet: boolean,
): string | false {
  // Gap only when `gap` is set — default spacing matches Dialog/Card via
  // Header/Body paddings (no shell gap).
  return gapPropSet ? POPOVER_GAP_CLASS[contentGap] : false;
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
  // `unstyled` skips gap/minmax — surface (border/bg) stays on the shell.
  // Padding lives on Header/Body (same tokens as Dialog/Card), not the shell.
  // Always keep size radius so overflow-hidden + border don't square the corners
  // (Dropdown / Select / ComboBox / ColorPicker use unstyled + own padding).
  if (unstyled) return panel.rounded;
  return cn(
    panel.rounded,
    panel.panelMin,
    panel.popoverMax,
    resolvePopoverGapClass(contentGap, gapPropSet),
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

export function popoverDefaultPanelClass({
  variant,
  size,
  unstyled,
  contentGap,
  gapPropSet,
  slotClass,
}: {
  variant: PopoverVariant;
  size: PopoverSize;
  unstyled: boolean;
  contentGap: PopoverContentGap;
  gapPropSet: boolean;
  slotClass?: string;
}): string {
  const visual = resolveVariantVisual(variant, KIT_POPOVER_VARIANTS, "popover.panel");
  return cn(
    POPOVER_PANEL_BASE_CLASS,
    visual.className !== undefined ? visual.className : POPOVER_PANEL_SURFACE_CLASS,
    popoverSizedPanelClasses({ size, unstyled, contentGap, gapPropSet }),
    slotClass,
  );
}

export function popoverArrowClass({
  variant,
  arrowSideClass,
  slotClass,
  className,
}: {
  variant: PopoverVariant;
  resolvedSide: PopoverSide;
  arrowSideClass: string;
  slotClass?: string;
  className?: string;
}): string {
  const visual = resolveVariantVisual(variant, KIT_POPOVER_VARIANTS, "popover.arrow");
  return cn(
    POPOVER_ARROW_BASE_CLASS,
    visual.className !== undefined ? visual.className : POPOVER_ARROW_DEFAULT_CLASS,
    arrowSideClass,
    slotClass,
    className,
  );
}

export function popoverHeaderClass({
  size,
  unstyled,
  slotClass,
  className,
}: {
  size: PopoverSize;
  unstyled?: boolean;
  slotClass?: string;
  className?: string;
}): string {
  const panel = panelSizeLayout(size);
  return cn(
    POPOVER_HEADER_CLASS,
    !unstyled && panel.headerPadding,
    panel.headingGap,
    slotClass,
    className,
  );
}

export function popoverTitleClass({
  size,
  slotClass,
  className,
}: {
  size: PopoverSize;
  slotClass?: string;
  className?: string;
}): string {
  return cn(
    POPOVER_LABEL_CLASS,
    panelSizeLayout(size).titleClassName,
    slotClass,
    className,
  );
}

export function popoverBodyClass({
  size,
  unstyled,
  slotClass,
  className,
}: {
  size: PopoverSize;
  unstyled?: boolean;
  slotClass?: string;
  className?: string;
}): string {
  return cn(
    POPOVER_BODY_CLASS,
    !unstyled && panelSizeLayout(size).bodyPadding,
    slotClass,
    className,
  );
}

export function popoverTitleVariant(size: PopoverSize): TextVariant {
  return POPOVER_TITLE_VARIANT[size];
}

export function popoverDescriptionVariant(size: PopoverSize): TextVariant {
  return POPOVER_DESCRIPTION_VARIANT[size];
}
