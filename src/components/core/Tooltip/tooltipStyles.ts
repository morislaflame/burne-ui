import { GLOSS_INTERACTIVE_MOTION_CLASS } from "@/components/core/utils/glossInteractiveMotion";
import { messageBannerGridClass } from "@/components/core/utils/messageBannerGridLayout";
import type { TextVariant } from "@/components/core/Text";

import { mergeTooltipSlotClass } from "./tooltipAPI";
import {
  TOOLTIP_ARROW_CLASS,
  TOOLTIP_ARROW_SHELL_PAD,
} from "./tooltipPosition";
import type { TooltipSize, TooltipSurface, TooltipVariant } from "./tooltipTypes";

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
  small: "max-w-[12rem] px-base py-xsmall",
  base: "max-w-[16rem] px-base py-small",
  mid: "max-w-[18rem] px-plus py-small",
  large: "max-w-xs px-plus py-base",
};

export const TOOLTIP_CONTENT_VARIANT: Record<TooltipSize, TextVariant> = {
  small: "tools",
  base: "small",
  mid: "small",
  large: "base",
};

export const TOOLTIP_DESC_VARIANT: Record<TooltipSize, TextVariant> = {
  small: "tools",
  base: "tools",
  mid: "tools",
  large: "small",
};

export const TOOLTIP_ICON_SIZE: Record<TooltipSize, string> = {
  small: "icon-small",
  base: "icon-base",
  mid: "icon-base",
  large: "icon-mid",
};

export const TOOLTIP_ICON_SLOT_SVG: Record<TooltipSize, string> = {
  small: "[&_svg]:icon-small",
  base: "[&_svg]:icon-base",
  mid: "[&_svg]:icon-base",
  large: "[&_svg]:icon-mid",
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
  small: "gap-x-xsmall",
  base: "gap-x-small",
  mid: "gap-x-base",
  large: "gap-x-base",
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

export const TOOLTIP_PANEL_BASE_CLASS =
  "relative z-[1] w-max min-w-0 rounded-mid text-left animate-shadow";

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
    return mergeTooltipSlotClass(
      messageBannerGridClass(gridSlots, TOOLTIP_GRID_GAP[size]),
      TOOLTIP_GLOSS_PANEL_BASE_CLASS,
      GLOSS_INTERACTIVE_MOTION_CLASS,
      TOOLTIP_TEXT_LAYOUT[size],
      slotClass,
      className,
    );
  }

  return mergeTooltipSlotClass(
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

  return mergeTooltipSlotClass(
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
  return mergeTooltipSlotClass(
    TOOLTIP_CONTENT_BASE_CLASS,
    showArrow && TOOLTIP_ARROW_SHELL_PAD[resolvedSide],
    slotClass,
    className,
  );
}
