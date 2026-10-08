import { resolveVariantVisual } from "@/skins/resolveVariantVisual";
import { cn } from "@/utils/cn";

import {
  KIT_SELECTION_INDICATOR_VARIANTS,
  type SelectionIndicatorSize,
  type SelectionIndicatorVariant,
} from "./selectionIndicatorTypes";

export const SELECTION_INDICATOR_SIZE_CLASS: Record<SelectionIndicatorSize, string> = {
  xsmall: "selection-indicator-xsmall",
  small: "selection-indicator-small",
  base: "selection-indicator-base",
  mid: "selection-indicator-mid",
  large: "selection-indicator-large",
};

/** Corner radius from `--selection-indicator-radius-*` (`--radius-*` × 0.618). */
export const SELECTION_INDICATOR_RADIUS_CLASS: Record<SelectionIndicatorSize, string> = {
  xsmall: "rounded-[var(--selection-indicator-radius-xsmall)]",
  small: "rounded-[var(--selection-indicator-radius-small)]",
  base: "rounded-[var(--selection-indicator-radius-base)]",
  mid: "rounded-[var(--selection-indicator-radius-mid)]",
  large: "rounded-[var(--selection-indicator-radius-large)]",
};

/** Mark icon box — `--icon-size-*` × 0.75 so marks fit inside the indicator ring. */
export const SELECTION_INDICATOR_ICON_CLASS: Record<SelectionIndicatorSize, string> = {
  xsmall: "size-[length:calc(var(--icon-size-xsmall)*0.75)]",
  small: "size-[length:calc(var(--icon-size-small)*0.75)]",
  base: "size-[length:calc(var(--icon-size-base)*0.75)]",
  mid: "size-[length:calc(var(--icon-size-mid)*0.75)]",
  large: "size-[length:calc(var(--icon-size-large)*0.75)]",
};

export const SELECTION_INDICATOR_MARK_CLASS =
  "pointer-events-none relative z-[2] inline-flex items-center justify-center";

export const SELECTION_INDICATOR_DASH_CLASS =
  "pointer-events-none h-[2px] w-1/2 rounded-full bg-current";

export function selectionIndicatorMarkCheckIconClass(size: SelectionIndicatorSize): string {
  return cn("icon-slot", SELECTION_INDICATOR_ICON_CLASS[size]);
}

/** Custom mark: the wrap is `icon-slot`, so `icon-*` on the svg wins over the fill. */
export function selectionIndicatorMarkCustomIconClass(size: SelectionIndicatorSize): string {
  return cn("icon-slot", SELECTION_INDICATOR_ICON_CLASS[size]);
}

export const SELECTION_INDICATOR_DOT_CLASS: Record<SelectionIndicatorSize, string> = {
  xsmall:
    "size-[calc(var(--selection-indicator-xsmall)*0.333333)] rounded-[var(--selection-indicator-radius-xsmall)]",
  small:
    "size-[calc(var(--selection-indicator-small)*0.333333)] rounded-[var(--selection-indicator-radius-small)]",
  base:
    "size-[calc(var(--selection-indicator-base)*0.333333)] rounded-[var(--selection-indicator-radius-base)]",
  mid:
    "size-[calc(var(--selection-indicator-mid)*0.333333)] rounded-[var(--selection-indicator-radius-mid)]",
  large:
    "size-[calc(var(--selection-indicator-large)*0.333333)] rounded-[var(--selection-indicator-radius-large)]",
};

export const SELECTION_INDICATOR_DOT_INNER_CLASS = "shrink-0 bg-indicator-foreground";

export const SELECTION_INDICATOR_DOT_INNER_OUTLINE_CLASS = "shrink-0 bg-foreground";

export const SELECTION_INDICATOR_SHELL_CLASS =
  "relative box-border inline-flex shrink-0 items-center justify-center overflow-hidden";

export const SELECTION_INDICATOR_FILL_BASE_CLASS =
  "pointer-events-none absolute -inset-[var(--border-width)] z-[0] flex origin-center items-center justify-center rounded-[inherit]";

export const SELECTION_INDICATOR_FILL_CLASS =
  "bg-indicator text-indicator-foreground";

export const SELECTION_INDICATOR_FILL_SECONDARY_CLASS =
  "bg-secondary text-secondary-foreground";

const INDICATOR_CSS_VAR: Record<SelectionIndicatorSize, string> = {
  xsmall: "--selection-indicator-xsmall",
  small: "--selection-indicator-small",
  base: "--selection-indicator-base",
  mid: "--selection-indicator-mid",
  large: "--selection-indicator-large",
};

const INDICATOR_SSR_REM: Record<SelectionIndicatorSize, number> = {
  xsmall: 0.875,
  small: 1,
  base: 1.125,
  mid: 1.25,
  large: 1.5,
};

export function selectionIndicatorFallbackPx(
  size: SelectionIndicatorSize,
  rootPx = 16,
): number {
  if (typeof document !== "undefined") {
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue(INDICATOR_CSS_VAR[size])
      .trim();
    const remMatch = /^([\d.]+)rem$/i.exec(raw);
    if (remMatch) return Number.parseFloat(remMatch[1]!) * rootPx;
    const pxMatch = /^([\d.]+)px$/i.exec(raw);
    if (pxMatch) return Number.parseFloat(pxMatch[1]!);
  }
  return INDICATOR_SSR_REM[size] * rootPx;
}

export function selectionIndicatorDotInnerClass(
  variant: SelectionIndicatorVariant,
): string {
  const key = resolveVariantVisual(
    variant,
    KIT_SELECTION_INDICATOR_VARIANTS,
    "selectionIndicator.mark",
  ).key;
  switch (key) {
    case "outline":
      return SELECTION_INDICATOR_DOT_INNER_OUTLINE_CLASS;
    case "secondary":
      return "shrink-0 bg-secondary-foreground";
    default:
      return SELECTION_INDICATOR_DOT_INNER_CLASS;
  }
}

export function selectionIndicatorShowsFill(variant: SelectionIndicatorVariant): boolean {
  const key = resolveVariantVisual(
    variant,
    KIT_SELECTION_INDICATOR_VARIANTS,
    "selectionIndicator.root",
  ).key;
  return key !== "outline";
}

export function selectionIndicatorFillClass(variant: SelectionIndicatorVariant): string {
  const visual = resolveVariantVisual(
    variant,
    KIT_SELECTION_INDICATOR_VARIANTS,
    "selectionIndicator.fill",
  );
  if (visual.className !== undefined) {
    return cn(SELECTION_INDICATOR_FILL_BASE_CLASS, visual.className);
  }

  const surfaceClass =
    visual.key === "secondary"
      ? SELECTION_INDICATOR_FILL_SECONDARY_CLASS
      : SELECTION_INDICATOR_FILL_CLASS;

  return cn(SELECTION_INDICATOR_FILL_BASE_CLASS, surfaceClass);
}

export function selectionIndicatorMarkColorClass(
  variant: SelectionIndicatorVariant,
): string {
  const key = resolveVariantVisual(
    variant,
    KIT_SELECTION_INDICATOR_VARIANTS,
    "selectionIndicator.mark",
  ).key;
  switch (key) {
    case "outline":
      return "text-foreground";
    case "secondary":
      return "text-secondary-foreground";
    default:
      return "text-indicator-foreground";
  }
}

export function selectionIndicatorShellClass(
  size: SelectionIndicatorSize,
  className?: string,
): string {
  return cn(
    SELECTION_INDICATOR_SHELL_CLASS,
    SELECTION_INDICATOR_SIZE_CLASS[size],
    SELECTION_INDICATOR_RADIUS_CLASS[size],
    className,
  );
}

export function selectionIndicatorVariantClass(
  variant: SelectionIndicatorVariant,
  _selected: boolean,
): string {
  const visual = resolveVariantVisual(
    variant,
    KIT_SELECTION_INDICATOR_VARIANTS,
    "selectionIndicator.root",
  );
  if (visual.className !== undefined) return visual.className;

  switch (visual.key) {
    case "default":
      return "border border-primary bg-surface";
    case "secondary":
      return "border-token bg-secondary";
    case "outline":
      return "border border-primary bg-surface";
    default:
      return "border border-primary bg-surface";
  }
}
