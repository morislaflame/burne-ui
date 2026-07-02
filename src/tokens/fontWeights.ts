/** Примитивная шкала начертания — совпадает с `--font-w-*` в `styles.css`. */
export const burneFontWeightScale = ["small", "base", "mid", "strong", "bold"] as const;

export type FontWeightStep = (typeof burneFontWeightScale)[number];

export const FONT_WEIGHT_CSS_VAR: Record<FontWeightStep, `--font-w-${FontWeightStep}`> = {
  small: "--font-w-small",
  base: "--font-w-base",
  mid: "--font-w-mid",
  strong: "--font-w-strong",
  bold: "--font-w-bold",
};

export const FONT_WEIGHT_DEFAULTS: Record<FontWeightStep, number> = {
  small: 400,
  base: 500,
  mid: 600,
  strong: 700,
  bold: 800,
};

/** CSS `var(--font-w-small|base|mid|strong|bold)` для inline-стилей и документации. */
export function fontWeightToken<S extends FontWeightStep>(step: S): `var(--font-w-${S})` {
  return `var(--font-w-${step})` as `var(--font-w-${S})`;
}
