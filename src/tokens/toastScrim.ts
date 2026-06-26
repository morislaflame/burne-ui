/** Токены мягкой подложки за стеком Toast — см. `--toast-scrim-*` в `styles.css`. */

export const TOAST_SCRIM_CSS_VAR = {
  size: "--toast-scrim-size",
  density: "--toast-scrim-density",
  height: "--toast-scrim-height",
  insetX: "--toast-scrim-inset-x",
  offsetY: "--toast-scrim-offset-y",
  gradientTop: "--toast-scrim-gradient-top",
  gradientBottom: "--toast-scrim-gradient-bottom",
  mask: "--toast-scrim-mask",
} as const;

export type ToastScrimCssVar = (typeof TOAST_SCRIM_CSS_VAR)[keyof typeof TOAST_SCRIM_CSS_VAR];

/** CSS `var(--toast-scrim-*)` для inline-стилей и документации. */
export function toastScrimToken<V extends ToastScrimCssVar>(name: V): `var(${V})` {
  return `var(${name})` as `var(${V})`;
}

/** Значения по умолчанию — совпадают с `:root` в tokens/styles.css. */
export const TOAST_SCRIM_DEFAULTS = {
  size: 1,
  density: 1,
} as const;
