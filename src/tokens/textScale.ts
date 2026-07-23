import primitives from "./tokenPrimitives.json" with { type: "json" };

/** Primitive typography sizes (rem) — single source with `tokens/styles.css` (via sync script). */
export const TEXT_SCALE_BASES = primitives.textScale;

export type TextScaleStep = keyof typeof TEXT_SCALE_BASES;
