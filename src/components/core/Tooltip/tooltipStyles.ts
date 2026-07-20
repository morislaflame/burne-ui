import { GLOSS_INTERACTIVE_MOTION_CLASS } from "@/components/core/utils/glossInteractiveMotion";
import { messageBannerGridClass } from "@/components/core/utils/messageBannerGridLayout";
import type { TextVariant } from "@/components/core/Text";

import {
  TOOLTIP_ARROW_CLASS,
  TOOLTIP_ARROW_SHELL_PAD,
} from "./tooltipPosition";
import type { TooltipSize, TooltipSurface, TooltipVariant } from "./tooltipTypes";

import { cn } from "@/utils/cn";

export { TOOLTIP_ARROW_CLASS, TOOLTIP_ARROW_SHELL_PAD };

export const TOOLTIP_DEFAULT_OFFSET = 8;

export const TOOLTIP_SURFACE_CLASS: Record<TooltipVariant, string> = {
  default: "border-token bg-surface",
  outline: "bg-transparent border-token",
  secondary: "bg-secondary border-token",
  danger: "bg-surface-tint-danger border-token",
  success: "bg-surface-tint-success border-token",
  info: "bg-surface-tint-info border-token",
  warning: "bg-surface-tint-warning border-token",
};

export const TOOLTIP_TEXT_LAYOUT: Record<TooltipSize, string> = {
  small: "max-w-[12rem] p-small",
  base: "max-w-[16rem] p-base",
  mid: "max-w-xs p-plus",
  large: "max-w-sm p-mid",
};

export const TOOLTIP_CONTENT_VARIANT: Record<TooltipSize, TextVariant> = {
  small: "tools",
  base: "small",
  mid: "base",
  large: "mid",
};

export const TOOLTIP_DESC_VARIANT: Record<TooltipSize, TextVariant> = {
  small: "tools",
  base: "tools",
  mid: "small",
  large: "base",
};

export const TOOLTIP_ICON_SIZE: Record<TooltipSize, string> = {
  small: "icon-small",
  base: "icon-base",
  mid: "icon-mid",
  large: "icon-large",
};

export const TOOLTIP_ICON_SLOT_SVG: Record<TooltipSize, string> = {
  small: "[&_svg]:icon-small",
  base: "[&_svg]:icon-base",
  mid: "[&_svg]:icon-mid",
  large: "[&_svg]:icon-large",
};

export const TOOLTIP_ICON_TEXT_CLASS: Record<TooltipVariant, string> = {
  default: "text-foreground",
  outline: "text-foreground",
  secondary: "text-secondary-foreground",
  danger: "text-danger",
  success: "text-success",
  info: "text-info",
  warning: "text-warning",
};

export const TOOLTIP_GRID_GAP: Record<TooltipSize, string> = {
  small: "gap-x-xsmall gap-y-0",
  base: "gap-x-small gap-y-xsmall",
  mid: "gap-x-base gap-y-xsmall",
  large: "gap-x-plus gap-y-small",
};

export const TOOLTIP_TRIGGER_BASE_CLASS = "inline-flex shrink-0";

export const TOOLTIP_INDICATOR_BASE_CLASS = "inline-flex shrink-0 [&_svg]:shrink-0";

export const TOOLTIP_DESCRIPTION_MUTED_CLASS = "text-muted";

export const TOOLTIP_ARROW_BASE_CLASS =
  "pointer-events-none absolute z-0 size-2 rotate-45";

export const TOOLTIP_ARROW_GLOSS_CLASS = "border-0 bg-[var(--color-surface)]";

export const TOOLTIP_CONTENT_BASE_CLASS =
  "pointer-events-none z-[10000] w-max min-w-0 overflow-visible text-left outline-none will-change-transform";

export const TOOLTIP_CONTENT_INNER_CLASS = "relative overflow-visible";

export const TOOLTIP_GLOSS_PANEL_BASE_CLASS =
  "gloss-panel gloss-deep relative z-[1] w-max min-w-0 origin-center overflow-hidden rounded-mid text-left text-foreground";

export const TOOLTIP_GLOSS_CONTENT_CLASS = "gloss-content";

/** Compound slots (`Tooltip.Message`) — pass-through grid children. */
export const TOOLTIP_COMPOUND_CONTENTS_CLASS = "contents";

export const TOOLTIP_PANEL_BASE_CLASS =
  "relative z-[1] w-max min-w-0 rounded-mid text-left animate-shadow";

export function tooltipGlossShellClass({
  size,
  slotClass,
  className,
}: {
  size: TooltipSize;
  slotClass?: string;
  className?: string;
}) {
  return cn(
    TOOLTIP_GLOSS_PANEL_BASE_CLASS,
    GLOSS_INTERACTIVE_MOTION_CLASS,
    TOOLTIP_TEXT_LAYOUT[size],
    slotClass,
    className,
  );
}

export function tooltipGlossContentClass({
  gridSlots,
  size,
  slotClass,
}: {
  gridSlots: Parameters<typeof messageBannerGridClass>[0];
  size: TooltipSize;
  slotClass?: string;
}) {
  return cn(
    messageBannerGridClass(gridSlots, TOOLTIP_GRID_GAP[size]),
    TOOLTIP_GLOSS_CONTENT_CLASS,
    slotClass,
  );
}

export function tooltipPanelClass({
  variant,
  surface,
  size,
  gridSlots,
  slotClass,
  className,
}: {
  variant: TooltipVariant;
  surface: TooltipSurface;
  size: TooltipSize;
  gridSlots: Parameters<typeof messageBannerGridClass>[0];
  slotClass?: string;
  className?: string;
}) {
  const isGloss = surface === "gloss";

  if (isGloss) {
    return tooltipGlossShellClass({ size, slotClass, className });
  }

  return cn(
    messageBannerGridClass(gridSlots, TOOLTIP_GRID_GAP[size]),
    TOOLTIP_PANEL_BASE_CLASS,
    TOOLTIP_SURFACE_CLASS[variant],
    TOOLTIP_TEXT_LAYOUT[size],
    slotClass,
    className,
  );
}

export function tooltipArrowClass({
  variant,
  surface,
  resolvedSide,
  slotClass,
  className,
}: {
  variant: TooltipVariant;
  surface: TooltipSurface;
  resolvedSide: keyof typeof TOOLTIP_ARROW_CLASS;
  slotClass?: string;
  className?: string;
}) {
  const isGloss = surface === "gloss";

  return cn(
    TOOLTIP_ARROW_BASE_CLASS,
    isGloss ? TOOLTIP_ARROW_GLOSS_CLASS : TOOLTIP_SURFACE_CLASS[variant],
    TOOLTIP_ARROW_CLASS[resolvedSide],
    slotClass,
    className,
  );
}

export function tooltipContentClass({
  resolvedSide,
  showArrow,
  slotClass,
  className,
}: {
  resolvedSide: keyof typeof TOOLTIP_ARROW_SHELL_PAD;
  showArrow: boolean;
  slotClass?: string;
  className?: string;
}) {
  return cn(
    TOOLTIP_CONTENT_BASE_CLASS,
    showArrow && TOOLTIP_ARROW_SHELL_PAD[resolvedSide],
    slotClass,
    className,
  );
}
