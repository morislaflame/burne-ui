import { cn } from "@/utils/cn";

export type SelectionIndicatorSize = "xsmall" | "small" | "base" | "mid" | "large";

export type SelectionIndicatorVariant = "default" | "secondary" | "outline" | "gloss";

export const SELECTION_INDICATOR_SIZE_CLASS: Record<SelectionIndicatorSize, string> = {
  xsmall: "selection-indicator-xsmall",
  small: "selection-indicator-small",
  base: "selection-indicator-base",
  mid: "selection-indicator-mid",
  large: "selection-indicator-large",
};

export const SELECTION_INDICATOR_ICON_CLASS: Record<SelectionIndicatorSize, string> = {
  xsmall: "icon-xsmall",
  small: "icon-xsmall",
  base: "icon-xsmall",
  mid: "icon-base",
  large: "icon-mid",
};

export const SELECTION_INDICATOR_MARK_CLASS =
  "pointer-events-none relative z-[2] inline-flex items-center justify-center";

export function selectionIndicatorMarkCheckIconClass(size: SelectionIndicatorSize): string {
  return cn("[&_svg]:size-full", SELECTION_INDICATOR_ICON_CLASS[size]);
}

/** Custom mark icons: no `[&_svg]:size-full` — `icon-*` on the icon itself controls size. */
export function selectionIndicatorMarkCustomIconClass(size: SelectionIndicatorSize): string {
  return SELECTION_INDICATOR_ICON_CLASS[size];
}

export const SELECTION_INDICATOR_DOT_CLASS: Record<SelectionIndicatorSize, string> = {
  xsmall: "size-[calc(var(--selection-indicator-xsmall)*0.333333)]",
  small: "size-[calc(var(--selection-indicator-small)*0.333333)]",
  base: "size-[calc(var(--selection-indicator-base)*0.333333)]",
  mid: "size-[calc(var(--selection-indicator-mid)*0.333333)]",
  large: "size-[calc(var(--selection-indicator-large)*0.333333)]",
};

export const SELECTION_INDICATOR_DOT_INNER_CLASS = "shrink-0 rounded-full bg-indicator-foreground";

export const SELECTION_INDICATOR_DOT_INNER_GLOSS_CLASS = "shrink-0 rounded-full bg-foreground";

export const SELECTION_INDICATOR_SHELL_CLASS =
  "relative box-border inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full";

export const SELECTION_INDICATOR_FILL_BASE_CLASS =
  "pointer-events-none absolute inset-px z-[0] flex origin-center items-center justify-center rounded-[inherit]";

export const SELECTION_INDICATOR_FILL_CLASS =
  "bg-indicator text-indicator-foreground";

export const SELECTION_INDICATOR_FILL_SECONDARY_CLASS =
  "bg-secondary text-secondary-foreground";

export const SELECTION_INDICATOR_FILL_GLOSS_CLASS =
  "pointer-events-none absolute inset-px z-[1] flex origin-center items-center justify-center rounded-[inherit] gloss-indicator-fill text-foreground";

/** Gloss fill for Switch/Slider thumb — primary-tint like ToggleButton, without gloss-indicator-fill. */
export const SELECTION_INDICATOR_FILL_GLOSS_TINT_CLASS = cn(
  SELECTION_INDICATOR_FILL_BASE_CLASS,
  "z-[1] rounded-[inherit] bg-primary-tint",
);

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
  switch (variant) {
    case "gloss":
    case "outline":
      return SELECTION_INDICATOR_DOT_INNER_GLOSS_CLASS;
    case "secondary":
      return "shrink-0 rounded-full bg-secondary-foreground";
    default:
      return SELECTION_INDICATOR_DOT_INNER_CLASS;
  }
}

export function selectionIndicatorShowsFill(variant: SelectionIndicatorVariant): boolean {
  return variant !== "outline";
}

export function selectionIndicatorFillClass(variant: SelectionIndicatorVariant): string {
  if (variant === "gloss") return SELECTION_INDICATOR_FILL_GLOSS_CLASS;

  const surfaceClass =
    variant === "secondary"
      ? SELECTION_INDICATOR_FILL_SECONDARY_CLASS
      : SELECTION_INDICATOR_FILL_CLASS;

  return cn(SELECTION_INDICATOR_FILL_BASE_CLASS, surfaceClass);
}

export function selectionIndicatorMarkColorClass(
  variant: SelectionIndicatorVariant,
): string {
  switch (variant) {
    case "gloss":
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
  return cn(SELECTION_INDICATOR_SHELL_CLASS, SELECTION_INDICATOR_SIZE_CLASS[size], className);
}

export function selectionIndicatorVariantClass(
  variant: SelectionIndicatorVariant,
  _selected: boolean,
): string {
  switch (variant) {
    case "default":
      return "border border-primary bg-surface";
    case "secondary":
      return "border-token bg-secondary";
    case "outline":
      return "border border-primary bg-surface";
    case "gloss":
      return "gloss-indicator border-0";
  }
}
