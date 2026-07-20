import type { ComponentSize } from "@/components/core/utils/componentSize";

export const SEARCH_INPUT_ICON_WRAP_CLASS =
  "pointer-events-none absolute inset-y-0 z-[1] flex items-center justify-center text-muted";

export const SEARCH_INPUT_ICON_CLASS = "shrink-0";

export const SEARCH_INPUT_CONTROL_BASE_CLASS =
  "box-border min-h-0 w-full border-0 bg-transparent text-foreground outline-none placeholder:text-muted [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none disabled:cursor-not-allowed disabled:opacity-100";

export const SEARCH_INPUT_CONTROL_EXPANDED_CLASS = "relative z-[2] opacity-100";

export const SEARCH_INPUT_CONTROL_COLLAPSED_CLASS =
  "pointer-events-none absolute inset-0 opacity-0";

export const SEARCH_INPUT_CLEAR_BUTTON_CLASS =
  "absolute top-1/2 z-[3] flex -translate-y-1/2 items-center justify-center rounded-full border-0 bg-transparent p-0 text-foreground outline-none focus-ring-inset cursor-pointer";

export const SEARCH_INPUT_CLEAR_ICON_CLASS = "shrink-0";

type SearchExpandedRadiusStep = "small" | "base" | "mid" | "large";

const SEARCH_EXPANDED_RADIUS_VALUE_VAR: Record<SearchExpandedRadiusStep, string> = {
  small: "--radius-value-small",
  base: "--radius-value-base",
  mid: "--radius-value-mid",
  large: "--radius-value-large",
};

const SEARCH_EXPANDED_RADIUS_STEP: Record<ComponentSize, SearchExpandedRadiusStep> = {
  small: "small",
  base: "base",
  mid: "mid",
  large: "large",
};

const SEARCH_EXPANDED_RADIUS_FALLBACK_MULT: Record<SearchExpandedRadiusStep, number> = {
  small: 0.75,
  base: 1,
  mid: 1.25,
  large: 1.5,
};

export const SEARCH_EXPANDED_ROUNDED_CLASS: Record<ComponentSize, string> = {
  small: "rounded-small",
  base: "rounded-base",
  mid: "rounded-mid",
  large: "rounded-large",
};

function parseCssLengthPx(raw: string, rootPx: number): number | undefined {
  const remMatch = /^([\d.]+)rem$/i.exec(raw);
  if (remMatch) return Number.parseFloat(remMatch[1]!) * rootPx;
  const pxMatch = /^([\d.]+)px$/i.exec(raw);
  if (pxMatch) return Number.parseFloat(pxMatch[1]!);
  return undefined;
}

/** Border radius in px for expanded SearchInput — reads `--radius-value-*` from `:root`. */
export function readSearchExpandedRadiusPx(size: ComponentSize, rootPx = 16): number {
  const step = SEARCH_EXPANDED_RADIUS_STEP[size];
  if (typeof document !== "undefined") {
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue(SEARCH_EXPANDED_RADIUS_VALUE_VAR[step])
      .trim();
    const parsed = parseCssLengthPx(raw, rootPx);
    if (parsed != null) return parsed;
  }
  return rootPx * 0.5 * SEARCH_EXPANDED_RADIUS_FALLBACK_MULT[step];
}
