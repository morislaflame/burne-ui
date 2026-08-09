import primitives from "./tokenPrimitives.json" with { type: "json" };

/** Component shadow levels — match `shadow-token-*` and `--shadow-*`. */
export const burneShadowScale = ["none", "small", "base", "mid", "large"] as const;

export type ShadowSize = (typeof burneShadowScale)[number];

export type ShadowLevel = Exclude<ShadowSize, "none">;

/** Rest / hover / press within one size family (not cross-tier). */
export type ShadowInteraction = "rest" | "hover" | "press";

export const SHADOW_CSS_VAR: Record<ShadowLevel, `--shadow-${ShadowLevel}`> = {
  small: "--shadow-small",
  base: "--shadow-base",
  mid: "--shadow-mid",
  large: "--shadow-large",
};

/** First-level appear-from-none (Button) — independent of `--shadow-base`. */
export const SHADOW_LIFT_CSS_VAR = "--shadow-lift" as const;

/** Theme knobs for `--shadow-opacity|blur|spread|offset-x|offset-y` (CSS defaults). */
export const SHADOW_KNOB_CSS_DEFAULTS = {
  opacity: 1,
  blur: 1,
  spread: 1,
  offsetX: 0,
  offsetY: 0,
} as const;

/** Opacity bases per theme × level × interaction — SSOT with `tokens/styles.css`. */
export const SHADOW_OPACITY_BASE = primitives.shadowOpacity;

/**
 * Geometry per level × interaction: `[offsetX, offsetY, blur, spread]`.
 * Rest arrays also exposed as single-layer lists for legacy `SHADOW_LAYER_GEOM[level][0]` readers.
 */
export const SHADOW_LAYER_GEOM = {
  small: [primitives.shadowGeom.small.rest] as const,
  base: [primitives.shadowGeom.base.rest] as const,
  mid: [primitives.shadowGeom.mid.rest] as const,
  large: [primitives.shadowGeom.large.rest] as const,
} as const;

export const SHADOW_INTERACTION_GEOM = primitives.shadowGeom;

/** CSS `var(--shadow-small|base|mid|large)` for inline styles and documentation. */
export function shadowToken<S extends ShadowLevel>(level: S): `var(--shadow-${S})` {
  return `var(--shadow-${level})` as `var(--shadow-${S})`;
}
