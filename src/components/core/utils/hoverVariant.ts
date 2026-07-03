import { cn } from "@/utils/cn";

export const SURFACE_COLOR_TRANSITION =
  "surface-color-transition motion-reduce:transition-none";

export const TEXT_COLOR_TRANSITION =
  "text-color-transition motion-reduce:transition-none";

/**
 * Hover background for interactive surfaces.
 * - `default` / `primary` / `secondary` — neutral and brand fills.
 * - `danger` … `warning` — tint on transparent/neutral background (Dropdown, ListBox).
 * - `danger-tint-hover` … — hover over `bg-surface-tint-*` (fields with status).
 * - `danger-fill` … `warning-fill` — hover over filled status surface (Button danger, etc.).
 */
export type HoverVariant =
  | "default"
  | "primary"
  | "secondary"
  | "danger"
  | "warning"
  | "info"
  | "success"
  | "danger-tint-hover"
  | "success-tint-hover"
  | "info-tint-hover"
  | "warning-tint-hover"
  | "danger-fill"
  | "warning-fill"
  | "info-fill"
  | "success-fill";

type HoverFocusMode = "focus-visible" | "focus-within";

const HOVER_VARIANT_BG: Record<
  HoverVariant,
  Record<HoverFocusMode, string>
> = {
  default: {
    "focus-visible":
      "hover:bg-default-hover focus-visible:bg-default-hover",
    "focus-within":
      "hover:bg-default-hover focus-within:bg-default-hover",
  },
  primary: {
    "focus-visible":
      "hover:bg-primary-hover focus-visible:bg-primary-hover",
    "focus-within":
      "hover:bg-primary-hover focus-within:bg-primary-hover",
  },
  secondary: {
    "focus-visible":
      "hover:bg-secondary-hover focus-visible:bg-secondary-hover",
    "focus-within":
      "hover:bg-secondary-hover focus-within:bg-secondary-hover",
  },
  danger: {
    "focus-visible":
      "hover:bg-surface-tint-danger focus-visible:bg-surface-tint-danger",
    "focus-within":
      "hover:bg-surface-tint-danger focus-within:bg-surface-tint-danger",
  },
  warning: {
    "focus-visible":
      "hover:bg-surface-tint-warning focus-visible:bg-surface-tint-warning",
    "focus-within":
      "hover:bg-surface-tint-warning focus-within:bg-surface-tint-warning",
  },
  info: {
    "focus-visible":
      "hover:bg-surface-tint-info focus-visible:bg-surface-tint-info",
    "focus-within":
      "hover:bg-surface-tint-info focus-within:bg-surface-tint-info",
  },
  success: {
    "focus-visible":
      "hover:bg-surface-tint-success focus-visible:bg-surface-tint-success",
    "focus-within":
      "hover:bg-surface-tint-success focus-within:bg-surface-tint-success",
  },
  "danger-tint-hover": {
    "focus-visible":
      "hover:bg-surface-tint-danger-hover focus-visible:bg-surface-tint-danger-hover",
    "focus-within":
      "hover:bg-surface-tint-danger-hover focus-within:bg-surface-tint-danger-hover",
  },
  "warning-tint-hover": {
    "focus-visible":
      "hover:bg-surface-tint-warning-hover focus-visible:bg-surface-tint-warning-hover",
    "focus-within":
      "hover:bg-surface-tint-warning-hover focus-within:bg-surface-tint-warning-hover",
  },
  "info-tint-hover": {
    "focus-visible":
      "hover:bg-surface-tint-info-hover focus-visible:bg-surface-tint-info-hover",
    "focus-within":
      "hover:bg-surface-tint-info-hover focus-within:bg-surface-tint-info-hover",
  },
  "success-tint-hover": {
    "focus-visible":
      "hover:bg-surface-tint-success-hover focus-visible:bg-surface-tint-success-hover",
    "focus-within":
      "hover:bg-surface-tint-success-hover focus-within:bg-surface-tint-success-hover",
  },
  "danger-fill": {
    "focus-visible":
      "hover:bg-danger-fill-hover focus-visible:bg-danger-fill-hover",
    "focus-within":
      "hover:bg-danger-fill-hover focus-within:bg-danger-fill-hover",
  },
  "warning-fill": {
    "focus-visible":
      "hover:bg-warning-fill-hover focus-visible:bg-warning-fill-hover",
    "focus-within":
      "hover:bg-warning-fill-hover focus-within:bg-warning-fill-hover",
  },
  "info-fill": {
    "focus-visible":
      "hover:bg-info-fill-hover focus-visible:bg-info-fill-hover",
    "focus-within":
      "hover:bg-info-fill-hover focus-within:bg-info-fill-hover",
  },
  "success-fill": {
    "focus-visible":
      "hover:bg-success-fill-hover focus-visible:bg-success-fill-hover",
    "focus-within":
      "hover:bg-success-fill-hover focus-within:bg-success-fill-hover",
  },
};

/** Hover/focus background without transition — for shells with their own `field-shell-transition`. */
export function hoverVariantBg(
  tone: HoverVariant = "default",
  focus: HoverFocusMode = "focus-visible",
): string {
  return HOVER_VARIANT_BG[tone][focus];
}

/** Hover background for interactive surfaces. */
export function hoverVariant(tone: HoverVariant = "default"): string {
  return cn(SURFACE_COLOR_TRANSITION, hoverVariantBg(tone, "focus-visible"));
}
