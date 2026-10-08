import { messageBannerGridClass } from "@/components/core/utils/messageBannerGridLayout";
import { iconSlotClass } from "@/components/core/utils/sizeLayout";
import type { SemanticStatus } from "@/components/core/utils/semanticStatusIcons";
import { SEMANTIC_STATUS_TEXT } from "@/components/core/utils/semanticStatusSurface";
import type { TextVariant } from "@/components/core/Text";

import { resolveVariantVisual } from "@/skins/resolveVariantVisual";
import { cn } from "@/utils/cn";

import { TOOLTIP_ARROW_CLASS, TOOLTIP_ARROW_SHELL_PAD } from "./tooltipPosition";
import type { TooltipSize, TooltipVariant, KitTooltipVariant } from "./tooltipTypes";
import { KIT_TOOLTIP_VARIANTS } from "./tooltipTypes";

export { TOOLTIP_ARROW_CLASS, TOOLTIP_ARROW_SHELL_PAD };

export const TOOLTIP_DEFAULT_OFFSET = 8;

/** Neutral shell by variant — status accents live on indicator + title (Alert / Toast). */
export const TOOLTIP_VARIANT_SURFACE_CLASS: Record<KitTooltipVariant, string> = {
  default: "border-token bg-surface text-foreground",
  outline: "bg-transparent border-token-outline text-foreground",
  secondary: "bg-secondary border-token text-secondary-foreground",
};

export const TOOLTIP_TEXT_LAYOUT: Record<TooltipSize, string> = {
  small: "max-w-component-xsmall p-small",
  base: "max-w-component-small p-base",
  mid: "max-w-component-base p-mid",
  large: "max-w-component-mid p-large",
};

export const TOOLTIP_CONTENT_VARIANT: Record<TooltipSize, TextVariant> = {
  small: "xsmall",
  base: "small",
  mid: "base",
  large: "mid",
};

export const TOOLTIP_DESC_VARIANT: Record<TooltipSize, TextVariant> = {
  small: "xsmall",
  base: "xsmall",
  mid: "small",
  large: "base",
};

export const TOOLTIP_ICON_SLOT_SIZE: Record<TooltipSize, string> = {
  small: iconSlotClass("small"),
  base: iconSlotClass("base"),
  mid: iconSlotClass("mid"),
  large: iconSlotClass("large"),
};

/** Status accent for indicator (and semantic SVG). Default → primary like Alert/Toast. */
export const TOOLTIP_STATUS_ICON_CLASS = "shrink-0";

export const TOOLTIP_STATUS_ACCENT_CLASS: Record<SemanticStatus, string> = {
  default: "text-primary",
  danger: SEMANTIC_STATUS_TEXT.danger,
  success: SEMANTIC_STATUS_TEXT.success,
  info: SEMANTIC_STATUS_TEXT.info,
  warning: SEMANTIC_STATUS_TEXT.warning,
};

export const TOOLTIP_GRID_GAP: Record<TooltipSize, string> = {
  small: "gap-x-xsmall gap-y-0",
  base: "gap-x-small gap-y-xsmall",
  mid: "gap-x-base gap-y-xsmall",
  large: "gap-x-mid gap-y-small",
};

export const TOOLTIP_TRIGGER_BASE_CLASS = "inline-flex shrink-0 outline-none focus-ring";

export const TOOLTIP_INDICATOR_BASE_CLASS = "inline-flex shrink-0";

export const TOOLTIP_TITLE_CLASS = "font-w-mid";

export const TOOLTIP_DESCRIPTION_MUTED_CLASS = "text-muted";

export const TOOLTIP_ARROW_BASE_CLASS =
  "pointer-events-none absolute z-0 size-2 rotate-45";

/** Arrow fill mirrors panel surface (no status tint). */
export const TOOLTIP_ARROW_FILL_CLASS: Record<KitTooltipVariant, string> = {
  default: "bg-surface",
  outline: "bg-transparent",
  secondary: "bg-secondary",
};

export const TOOLTIP_CONTENT_BASE_CLASS =
  "pointer-events-none z-tooltip w-max min-w-0 overflow-visible text-start outline-none";

export const TOOLTIP_CONTENT_INNER_CLASS = "relative overflow-visible";

/** Compound slots (`Tooltip.Message`) — pass-through grid children. */
export const TOOLTIP_COMPOUND_CONTENTS_CLASS = "contents";

export const TOOLTIP_PANEL_BASE_CLASS =
  "relative z-[1] w-max min-w-0 rounded-mid text-start";

export const TOOLTIP_PANEL_SHADOW_CLASS = "shadow-token-large";

export function tooltipTitleClass(status: SemanticStatus): string {
  return cn(
    TOOLTIP_TITLE_CLASS,
    status !== "default" ? TOOLTIP_STATUS_ACCENT_CLASS[status] : "",
  );
}

export function tooltipIndicatorClass(
  status: SemanticStatus,
  slotClass?: string,
  className?: string,
): string {
  return cn(
    TOOLTIP_INDICATOR_BASE_CLASS,
    TOOLTIP_STATUS_ACCENT_CLASS[status],
    slotClass,
    className,
  );
}

export function tooltipPanelClass({
  variant,
  size,
  gridSlots,
  slotClass,
  className,
}: {
  variant: TooltipVariant;
  size: TooltipSize;
  gridSlots: Parameters<typeof messageBannerGridClass>[0];
  slotClass?: string;
  className?: string;
}) {
  const visual = resolveVariantVisual(variant, KIT_TOOLTIP_VARIANTS, "tooltip.panel");

  return cn(
    messageBannerGridClass(gridSlots, TOOLTIP_GRID_GAP[size]),
    TOOLTIP_PANEL_BASE_CLASS,
    visual.className !== undefined
      ? visual.className
      : cn(TOOLTIP_PANEL_SHADOW_CLASS, TOOLTIP_VARIANT_SURFACE_CLASS[visual.key]),
    TOOLTIP_TEXT_LAYOUT[size],
    slotClass,
    className,
  );
}

export function tooltipArrowClass({
  variant,
  resolvedSide,
  slotClass,
  className,
}: {
  variant: TooltipVariant;
  resolvedSide: keyof typeof TOOLTIP_ARROW_CLASS;
  slotClass?: string;
  className?: string;
}) {
  const visual = resolveVariantVisual(variant, KIT_TOOLTIP_VARIANTS, "tooltip.arrow");

  return cn(
    TOOLTIP_ARROW_BASE_CLASS,
    visual.className !== undefined
      ? visual.className
      : TOOLTIP_ARROW_FILL_CLASS[visual.key],
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
