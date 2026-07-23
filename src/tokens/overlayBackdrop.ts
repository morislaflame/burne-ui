/** Modal overlay backdrop tokens — see `--overlay-backdrop-*` in `tokens/styles.css`. */

export const OVERLAY_BACKDROP_CSS_VAR = {
  color: "--overlay-backdrop-color",
  blur: "--overlay-backdrop-blur",
  saturate: "--overlay-backdrop-saturate",
  scrim: "--overlay-backdrop-scrim",
} as const;

export type OverlayBackdropCssVar =
  (typeof OVERLAY_BACKDROP_CSS_VAR)[keyof typeof OVERLAY_BACKDROP_CSS_VAR];

/** CSS `var(--overlay-backdrop-*)` for inline styles and documentation. */
export function overlayBackdropToken<V extends OverlayBackdropCssVar>(
  name: V,
): `var(${V})` {
  return `var(${name})` as `var(${V})`;
}

/** Defaults — match `:root` in tokens/styles.css. */
export const OVERLAY_BACKDROP_DEFAULTS = {
  color: "color-mix(in oklab, var(--color-foreground) 14%, transparent)",
  blur: "14px",
  saturate: 1.5,
  scrim: "color-mix(in oklab, black 58%, transparent)",
} as const;
