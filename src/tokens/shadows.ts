/** Component shadow levels — match `shadow-token-*` and `--shadow-*`. */
export const burneShadowScale = ["none", "base", "mid", "large"] as const;

export type ShadowSize = (typeof burneShadowScale)[number];

export type ShadowLevel = Exclude<ShadowSize, "none">;

export const SHADOW_CSS_VAR: Record<ShadowLevel, `--shadow-${ShadowLevel}`> = {
  base: "--shadow-base",
  mid: "--shadow-mid",
  large: "--shadow-large",
};

/** CSS `var(--shadow-base|mid|large)` for inline styles and documentation. */
export function shadowToken<S extends ShadowLevel>(level: S): `var(--shadow-${S})` {
  return `var(--shadow-${level})` as `var(--shadow-${S})`;
}
