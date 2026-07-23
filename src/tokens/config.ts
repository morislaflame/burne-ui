/**
 * Token layer metadata. Values are defined in `./styles.css`,
 * Tailwind utilities — in `src/styles.css` (`@theme`, `@utility`).
 *
 * Customization:
 * - `--space` — spacing (gap, padding); steps `gap-*`, `p-*` via multipliers; fluid `clamp` by viewport.
 * - `--size` — control sizes (icons, indicators, button min-width, modal max-w); fluid `clamp` by viewport.
 * - `--radius` — base radius; `rounded-*` steps via multipliers; fluid `clamp` by viewport.
 * - `--shadow-size` — blur/offset multiplier for `--shadow-base|mid|large`.
 * - `--toast-scrim-size` / `--toast-scrim-density` — Toast scrim backdrop size and density.
 * - `--focus-ring-width` / `--focus-ring-offset` — keyboard focus ring geometry (`focus-ring*` utilities).
 * - `--z-dialog` / `--z-dropdown` / `--z-popover` / `--z-toast` / `--z-tooltip` — overlay stacking (`z-*` utilities).
 * - `--text-scale-*` — primitive typography (`xsmall` … `3xlarge`, base step `base`); roles `text-base`, `text-large` are aliases.
 * - `--font-w-*` — primitive font-weight scale;
 */
export const tokensConfig = {
  /** Namespace for documentation */
  namespace: "burne" as const,
  tailwindBridge: {
    "font-sans": "font-family-sans",
    "font-mono": "font-family-mono",
    "spacing-xsmall": "space-xsmall",
    "spacing-small": "space-small",
    "spacing-base": "space-base",
    "spacing-plus": "space-plus",
    "spacing-mid": "space-mid",
    "spacing-large": "space-large",
    "spacing-xlarge": "space-xlarge",
    "radius-xsmall": "radius-value-xsmall",
    "radius-small": "radius-value-small",
    "radius-base": "radius-value-base",
    "radius-mid": "radius-value-mid",
    "radius-large": "radius-value-large",
    "color-background": "color-background",
    "color-foreground": "color-foreground",
    "color-muted": "color-muted",
    "color-surface": "color-surface",
    "color-border": "color-border",
    "border-token": "color-border",
    "color-primary": "color-primary",
    "color-primary-foreground": "color-primary-foreground",
    "color-primary-hover": "color-primary-hover",
    "color-default-hover": "color-default-hover",
    "color-primary-tint": "color-primary-tint",
    "color-primary-tint-strong": "color-primary-tint-strong",
    "color-indicator": "color-indicator",
    "color-indicator-foreground": "color-indicator-foreground",
    "color-secondary": "color-secondary",
    "color-secondary-foreground": "color-secondary-foreground",
    "color-secondary-hover": "color-secondary-hover",
    "color-tertiary": "color-tertiary",
    "color-tertiary-foreground": "color-tertiary-foreground",
    "color-tertiary-hover": "color-tertiary-hover",
    "color-focus-ring": "color-focus-ring",
    "color-converge-ripple-primary-fill": "color-converge-ripple-primary-fill",
    "color-converge-ripple-neutral": "color-converge-ripple-neutral",
    "color-converge-ripple-neutral-muted": "color-converge-ripple-neutral-muted",
    "color-converge-ripple-danger": "color-converge-ripple-danger",
    "color-converge-ripple-info": "color-converge-ripple-info",
    "color-converge-ripple-success": "color-converge-ripple-success",
    "color-converge-ripple-warning": "color-converge-ripple-warning",
    "color-danger": "color-danger",
    "color-danger-foreground": "color-danger-foreground",
    "color-danger-fill-hover": "color-danger-fill-hover",
    "color-success": "color-success",
    "color-success-foreground": "color-success-foreground",
    "color-success-fill-hover": "color-success-fill-hover",
    "color-info": "color-info",
    "color-info-foreground": "color-info-foreground",
    "color-info-fill-hover": "color-info-fill-hover",
    "color-warning": "color-warning",
    "color-warning-foreground": "color-warning-foreground",
    "color-warning-fill-hover": "color-warning-fill-hover",
    "color-surface-tint-danger": "color-surface-tint-danger",
    "color-surface-tint-success": "color-surface-tint-success",
    "color-surface-tint-info": "color-surface-tint-info",
    "color-surface-tint-warning": "color-surface-tint-warning",
    "color-surface-tint-danger-hover": "color-surface-tint-danger-hover",
    "color-surface-tint-success-hover": "color-surface-tint-success-hover",
    "color-surface-tint-info-hover": "color-surface-tint-info-hover",
    "color-surface-tint-warning-hover": "color-surface-tint-warning-hover",
    "icon-xsmall": "icon-size-xsmall",
    "icon-small": "icon-size-small",
    "icon-base": "icon-size-base",
    "icon-mid": "icon-size-mid",
    "icon-large": "icon-size-large",
    "icon-xlarge": "icon-size-xlarge",
    "icon-2xlarge": "icon-size-2xlarge",
  },
} as const;

/** `--spacing-*` steps → `gap-*`, `p-*`, `m-*`, `space-*`, … utilities */
export const burneSpacingScale = [
  "xsmall",
  "small",
  "base",
  "plus",
  "mid",
  "large",
  "xlarge",
] as const;

/** `--radius-*` steps → `rounded-*` utilities */
export const burneRadiusScale = [
  "xsmall",
  "small",
  "base",
  "mid",
  "large",
] as const;

/**
 * `@utility text-*` roles (size/weight); not to be confused with `text-foreground` and other colors.
 * `text-base` — Tailwind default override; no separate entry needed in merge.
 */
export const burneTextScale = [
  "small",
  "mid",
  "tools",
  "accent-header",
  "header-1",
  "header-2",
  "large",
] as const;

export {
  burneShadowScale,
  type ShadowSize,
  type ShadowLevel,
  SHADOW_CSS_VAR,
  shadowToken,
} from "./shadows";
export {
  TOAST_SCRIM_CSS_VAR,
  TOAST_SCRIM_DEFAULTS,
  toastScrimToken,
  type ToastScrimCssVar,
} from "./toastScrim";

export type TokensConfig = typeof tokensConfig;
