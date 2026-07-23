import primitives from "./tokenPrimitives.json" with { type: "json" };

/** Component shadow levels — match `shadow-token-*` and `--shadow-*`. */
export const burneShadowScale = ["none", "base", "mid", "large"] as const;

export type ShadowSize = (typeof burneShadowScale)[number];

export type ShadowLevel = Exclude<ShadowSize, "none">;

export const SHADOW_CSS_VAR: Record<ShadowLevel, `--shadow-${ShadowLevel}`> = {
  base: "--shadow-base",
  mid: "--shadow-mid",
  large: "--shadow-large",
};

/** Default `--shadow-size` in `tokens/styles.css` (theme knob identity is separate in SCALE_DEFAULTS). */
export const SHADOW_SIZE_CSS_DEFAULT = primitives.shadowSize;

/** Opacity bases per theme × level — single source with `tokens/styles.css` (via sync script). */
export const SHADOW_OPACITY_BASE = primitives.shadowOpacity;

/** One layer: [offsetX, offsetY, blur, spread] — single source with CSS (via sync script). */
export const SHADOW_LAYER_GEOM = {
  base: [primitives.shadowGeom.base] as const,
  mid: [primitives.shadowGeom.mid] as const,
  large: [primitives.shadowGeom.large] as const,
} as const;

/** CSS `var(--shadow-base|mid|large)` for inline styles and documentation. */
export function shadowToken<S extends ShadowLevel>(level: S): `var(--shadow-${S})` {
  return `var(--shadow-${level})` as `var(--shadow-${S})`;
}
