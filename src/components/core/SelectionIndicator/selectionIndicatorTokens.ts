import { cn } from "@/utils/cn";

/** Размер круглого индикатора — через `--selection-indicator-*` в теме. */
export type SelectionIndicatorSize = "small" | "base" | "mid" | "large";

export type SelectionIndicatorVariant = "base" | "secondary" | "outline";

export const SELECTION_INDICATOR_SIZE_CLASS: Record<SelectionIndicatorSize, string> = {
  small: "selection-indicator-small",
  base: "selection-indicator-base",
  mid: "selection-indicator-mid",
  large: "selection-indicator-large",
};

export const SELECTION_INDICATOR_ICON_CLASS: Record<SelectionIndicatorSize, string> = {
  small: "icon-xsmall",
  base: "icon-xsmall",
  mid: "icon-base",
  large: "icon-mid",
};

export const SELECTION_INDICATOR_SHELL_CLASS =
  "relative box-border inline-flex shrink-0 items-center justify-center rounded-full";

export const SELECTION_INDICATOR_FILL_CLASS =
  "pointer-events-none absolute inset-px z-[0] flex origin-center items-center justify-center rounded-full bg-indicator text-indicator-foreground";

const INDICATOR_CSS_VAR: Record<SelectionIndicatorSize, string> = {
  small: "--selection-indicator-small",
  base: "--selection-indicator-base",
  mid: "--selection-indicator-mid",
  large: "--selection-indicator-large",
};

/** SSR-fallback, если CSS-переменные ещё недоступны (совпадает с tokens/styles.css). */
const INDICATOR_SSR_REM: Record<SelectionIndicatorSize, number> = {
  small: 1,
  base: 1.125,
  mid: 1.5,
  large: 1.75,
};

/**
 * Диаметр индикатора в px до первого измерения DOM.
 * Нужен Switch/Slider: расчёт travel/thumb до layout (ResizeObserver).
 */
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

export function selectionIndicatorShellClass(
  size: SelectionIndicatorSize,
  className?: string,
): string {
  return cn(SELECTION_INDICATOR_SHELL_CLASS, SELECTION_INDICATOR_SIZE_CLASS[size], className);
}

export function selectionIndicatorVariantClass(
  variant: SelectionIndicatorVariant,
  selected: boolean,
): string {
  switch (variant) {
    case "base":
      return "border border-primary bg-surface";
    case "secondary":
      return cn("surface-secondary", selected && "border-primary");
    case "outline":
      return cn("bordered-transparent", selected && "border-primary");
  }
}
