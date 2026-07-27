/**
 * Token layer metadata. Values are defined in `./styles.css`,
 * Tailwind utilities — in `src/styles.css` (`@theme`, `@utility`).
 *
 * ## Naming layers (knob → steps → Tailwind)
 *
 * | Domain | Knob | Design steps | Tailwind `@theme` bridge | Utilities |
 * |---|---|---|---|---|
 * | Spacing | `--space` | `--space-*` | `--spacing-*` (Tailwind spacing ns) | `gap-*`, `p-*`, `m-*` |
 * | Radius | `--radius` | `--radius-*` | `--radius-*` (identity) | `rounded-*` |
 * | Control box | — | `--control-height-*` | — | `h-control-*`, `min-h-control-*` |
 * | Control square | — | `--control-size-*` (= height) | — | `w-control-*`, `min/max-w-control-*` |
 * | Icons | `--size` | `--size-scale-*` → `--icon-size-*` (1:1) | — | `icon-xsmall` … `icon-3xlarge` |
 * | Indicators | `--size` / `--radius` | `--selection-indicator-*` + `--selection-indicator-radius-*` (`--radius-*` × 0.75) | — | `selection-indicator-*` |
 * | Panels | `--size` | `--max-component-*` | — | `min/max-w-component-*` |
 *
 * ## Typography
 *
 * `--text-scale-*` steps (rem) align with semantic roles / utilities of the same name:
 * `xsmall` 0.6875 · `small` 0.75 · `base` 0.875 · `mid` 1 · `large` 1.25 ·
 * `xlarge` 1.5 · `2xlarge` 1.875 · `3xlarge` 2.25.
 * Headers: `text-header-2` → `xlarge`, `text-header-1` → `2xlarge`, `text-accent-header` → `3xlarge`.
 *
 * Customization:
 * - `--space` — spacing (gap, padding); steps `gap-*`, `p-*` via multipliers; fluid `clamp` by viewport (theme JS writes scaled `clamp`, not fixed rem).
 * - `--size` — control sizes (icons, indicators, button min-width, modal max-w); fluid `clamp` by viewport.
 * - `--radius` — base radius; `rounded-*` steps via tight multipliers
 *   (`0.75 / 0.875 / 1 / 1.125 / 1.25`); fluid `clamp` by viewport.
 * - `--shadow-size` — blur/offset multiplier for `--shadow-base|mid|large` (`calc(… * var(--shadow-size))`; do not bake px).
 * - `--toast-scrim-size` / `--toast-scrim-density` — Toast scrim backdrop size and density.
 * - `--focus-ring-width` / `--focus-ring-offset` — keyboard focus ring geometry (`focus-ring*` utilities).
 * - `--motion-surface-duration` — CSS transitions for `surface-color-transition` / `animate-shadow` / field shells (from `surfaceTransitionDuration` in motion config).
 * - `--overlay-backdrop-color` / `--overlay-backdrop-blur` / `--overlay-backdrop-saturate` — frosted modal scrim (`overlay-backdrop`); `--overlay-backdrop-scrim` — solid dark-UI scrim.
 * - `--z-dialog` / `--z-dropdown` / `--z-popover` / `--z-toast` / `--z-tooltip` — overlay stacking (`z-*` utilities).
 * - `--max-component-*` — panel/container widths (`min/max-w-component-*`); Dialog size props map onto base…2xlarge.
 * - `NARROW_VIEWPORT_MAX_PX` (1024) — shared with CSS `field-control-mobile-no-zoom` media query.
 * - `--text-scale-*` — primitive typography; roles `text-base` / `text-mid` / … map 1:1 by name.
 * - `--font-w-*` — primitive font-weight scale;
 *
 * Fonts / text-scale / shadow geometry defaults: `tokenPrimitives.json` → TS modules + generated CSS
 * (`npm run sync:tokens` / `scripts/sync-generated-tokens.mjs`).
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
    "spacing-mid": "space-mid",
    "spacing-large": "space-large",
    "spacing-xlarge": "space-xlarge",
    "spacing-2xlarge": "space-2xlarge",
    "spacing-3xlarge": "space-3xlarge",
    "radius-xsmall": "radius-xsmall",
    "radius-small": "radius-small",
    "radius-base": "radius-base",
    "radius-mid": "radius-mid",
    "radius-large": "radius-large",
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
    "color-focus-ring-danger": "color-focus-ring-danger",
    "color-focus-ring-success": "color-focus-ring-success",
    "color-focus-ring-info": "color-focus-ring-info",
    "color-focus-ring-warning": "color-focus-ring-warning",
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
    "icon-3xlarge": "icon-size-3xlarge",
  },
} as const;

/** `--spacing-*` steps → `gap-*`, `p-*`, `m-*`, `space-*`, … utilities */
export const burneSpacingScale = [
  "xsmall",
  "small",
  "base",
  "mid",
  "large",
  "xlarge",
  "2xlarge",
  "3xlarge",
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
 * Icon utilities `icon-*` — 1:1 with `--size-scale-*` / `--icon-size-*`.
 * SelectionIndicator marks use `--icon-size-*` × 0.75 in component tokens.
 */
export const burneIconScale = [
  "xsmall",
  "small",
  "base",
  "mid",
  "large",
  "xlarge",
  "2xlarge",
  "3xlarge",
] as const;

/**
 * `@utility text-*` roles (size/weight); not to be confused with `text-foreground` and other colors.
 * `text-base` — Tailwind default override; maps 1:1 to `--text-scale-base` (0.875rem).
 */
export const burneTextScale = [
  "small",
  "mid",
  "xsmall",
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
