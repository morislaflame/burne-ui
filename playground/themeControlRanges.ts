/** Shared min/max/step for playground Theme Scale controls.
 *
 * `min`/`max` — slider range.
 * `shuffleMin`/`shuffleMax` — band used by Shuffle (keeps themes looking sane).
 */

export const SCALE_CONTROLS = [
  {
    key: "space" as const,
    min: 0.3,
    max: 0.8,
    shuffleMin: 0.35,
    shuffleMax: 0.65,
    step: 0.025,
    unit: "rem",
  },
  {
    key: "size" as const,
    min: 0.8,
    max: 1.25,
    shuffleMin: 0.85,
    shuffleMax: 1.15,
    step: 0.025,
    unit: "rem",
  },
  {
    key: "radius" as const,
    min: 0,
    max: 1,
    shuffleMin: 0,
    shuffleMax: 1,
    step: 0.025,
    unit: "rem",
  },
  {
    key: "borderWidth" as const,
    min: 0,
    max: 3,
    shuffleMin: 0,
    shuffleMax: 2,
    step: 0.5,
    unit: "px",
  },
  {
    key: "focusRingWidth" as const,
    min: 0,
    max: 3,
    shuffleMin: 0,
    shuffleMax: 3,
    step: 0.5,
    unit: "px",
  },
  {
    key: "focusRingOffset" as const,
    min: 0,
    max: 6,
    shuffleMin: 0,
    shuffleMax: 4,
    step: 1,
    unit: "px",
  },
  {
    key: "textScale" as const,
    min: 0.85,
    max: 1.2,
    shuffleMin: 0.95,
    shuffleMax: 1.15,
    step: 0.025,
    unit: "×",
  },
  {
    key: "letterSpacing" as const,
    min: -0.05,
    max: 0.12,
    shuffleMin: -0.05,
    shuffleMax: 0.12,
    step: 0.005,
    unit: "em",
  },
] as const;

export type ScaleControlKey = (typeof SCALE_CONTROLS)[number]["key"];

/** Shared min/max/step for playground Theme Shadow controls. */
export const SHADOW_CONTROLS = [
  {
    key: "shadowOpacity" as const,
    min: 0,
    max: 2,
    shuffleMin: 0.75,
    shuffleMax: 1.35,
    step: 0.05,
    unit: "×",
  },
  {
    key: "shadowBlur" as const,
    min: 0,
    max: 3,
    shuffleMin: 0.75,
    shuffleMax: 1.5,
    step: 0.05,
    unit: "×",
  },
  {
    key: "shadowSpread" as const,
    min: 0,
    max: 3,
    shuffleMin: 0.75,
    shuffleMax: 1.5,
    step: 0.05,
    unit: "×",
  },
  {
    key: "shadowOffsetX" as const,
    min: -24,
    max: 24,
    shuffleMin: -4,
    shuffleMax: 4,
    step: 1,
    unit: "px",
  },
  {
    key: "shadowOffsetY" as const,
    min: -24,
    max: 24,
    shuffleMin: 0,
    shuffleMax: 4,
    step: 1,
    unit: "px",
  },
] as const;

export type ShadowControlKey = (typeof SHADOW_CONTROLS)[number]["key"];
