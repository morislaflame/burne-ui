import type { ComponentSize } from "@/components/core/utils/componentSize";

export type RadiusStep = "xsmall" | "small" | "base" | "mid" | "large";

const RADIUS_VALUE_VAR: Record<RadiusStep, string> = {
  xsmall: "--radius-value-xsmall",
  small: "--radius-value-small",
  base: "--radius-value-base",
  mid: "--radius-value-mid",
  large: "--radius-value-large",
};

const RADIUS_STEP_MULTIPLIER: Record<RadiusStep, number> = {
  xsmall: 0.5,
  small: 0.75,
  base: 1,
  mid: 1.25,
  large: 1.5,
};

/** `--radius-*` tier for expanded SearchInput by control size. */
const SEARCH_EXPANDED_RADIUS_STEP: Record<ComponentSize, RadiusStep> = {
  small: "small",
  base: "base",
  mid: "mid",
  large: "large",
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

/** Border radius in px — reads `--radius-value-*` from `:root`. */
export function readRadiusPx(step: RadiusStep, rootPx = 16): number {
  if (typeof document !== "undefined") {
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue(RADIUS_VALUE_VAR[step])
      .trim();
    const parsed = parseCssLengthPx(raw, rootPx);
    if (parsed != null) return parsed;
  }
  return rootPx * 0.5 * RADIUS_STEP_MULTIPLIER[step];
}

export function readSearchExpandedRadiusPx(size: ComponentSize, rootPx = 16): number {
  return readRadiusPx(SEARCH_EXPANDED_RADIUS_STEP[size], rootPx);
}
