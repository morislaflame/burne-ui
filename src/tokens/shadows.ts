/** Ступени тени компонентов — совпадают с `shadow-token-*` и `--shadow-*`. */
export const burneShadowScale = ["none", "sm", "md", "lg"] as const;

export type ShadowSize = (typeof burneShadowScale)[number];

export type ShadowLevel = Exclude<ShadowSize, "none">;

export const SHADOW_CSS_VAR: Record<ShadowLevel, `--shadow-${ShadowLevel}`> = {
  sm: "--shadow-sm",
  md: "--shadow-md",
  lg: "--shadow-lg",
};

/** CSS `var(--shadow-sm|md|lg)` для inline-стилей и документации. */
export function shadowToken<S extends ShadowLevel>(level: S): `var(--shadow-${S})` {
  return `var(--shadow-${level})` as `var(--shadow-${S})`;
}
