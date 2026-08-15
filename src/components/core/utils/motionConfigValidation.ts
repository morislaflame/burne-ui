/**
 * Runtime validation for `configureMotion` overrides.
 * Invalid fields are skipped (dev warning); out-of-range finite numbers are clamped.
 * Does not mutate the live config — returns only accepted fields.
 */
import type { MotionConfig } from "./motionConfig";

export const MOTION_CONFIG_LIMITS = {
  durationMs: { min: 0, max: 60_000 },
  scale: { min: 0.5, max: 2 },
  pressSqueezeScale: { min: 0.5, max: 2 },
  factor: { min: 0, max: 4 },
  opacity: { min: 0, max: 1 },
} as const;

const DURATION_KEYS = [
  "interactiveDuration",
  "tooltipDuration",
  "modalDuration",
  "switchThumbDuration",
  "selectionFillDuration",
  "rippleDefaultDuration",
  "rippleExpandableDuration",
  "feedbackExpandDuration",
  "expandDuration",
  "surfaceTransitionDuration",
  "toastDismissDuration",
  "progressFillDuration",
  "progressIndeterminateDuration",
  "loadingDotsDuration",
] as const satisfies readonly (keyof MotionConfig)[];

const EASE_KEYS = [
  "interactiveEase",
  "hoverLiftEase",
  "switchThumbEase",
  "selectionFillEase",
  "expandOpenEase",
  "toastDismissEase",
  "progressFillEase",
  "progressIndeterminateEase",
  "loadingDotsEaseUp",
  "loadingDotsEaseDown",
] as const satisfies readonly (keyof MotionConfig)[];

const FLAG_KEYS = [
  "enableAnimations",
  "enableHoverLift",
  "enablePressSqueeze",
  "enableToggleButtonFill",
  "enableRipple",
  "enableExpandable",
  "enableToastStack",
  "enableAsyncButtonCrossfade",
  "enableContentFade",
  "enableFeedbackExpand",
  "enableProgressFill",
  "enableLoadingDots",
  "enableModalMotion",
  "enableSwitchThumb",
  "enableTabsIndicator",
  "enablePaginationFlip",
  "enableSelectionFill",
] as const satisfies readonly (keyof MotionConfig)[];

const SCALE_KEYS = ["hoverLiftScale", "badgeAnchorHoverLiftScale"] as const satisfies readonly (keyof MotionConfig)[];

const OPACITY_KEYS = [
  "rippleDefaultOpacityFrom",
  "rippleExpandableOpacityFrom",
] as const satisfies readonly (keyof MotionConfig)[];

const CUBIC_BEZIER_RE =
  /^cubic-bezier\(\s*(-?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(-?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(-?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(-?(?:\d+(?:\.\d+)?|\.\d+))\s*\)$/i;

function warnMotionConfig(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.warn(`[burne-ui] configureMotion: ${message}`);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function acceptClamped(
  key: string,
  value: unknown,
  min: number,
  max: number,
): number | undefined {
  if (!isFiniteNumber(value)) {
    warnMotionConfig(`ignored ${key}=${String(value)} (need a finite number)`);
    return undefined;
  }
  const next = clamp(value, min, max);
  if (next !== value) {
    warnMotionConfig(`clamped ${key} from ${value} to ${next}`);
  }
  return next;
}

/**
 * Parse `rippleEaseCss` (`cubic-bezier(x1, y1, x2, y2)`).
 * Allows negatives, leading-dot (`.25`), values > 1, and flexible whitespace.
 */
export function parseRippleEaseCss(
  css: string,
): readonly [number, number, number, number] | null {
  if (typeof css !== "string") return null;
  const m = CUBIC_BEZIER_RE.exec(css.trim());
  if (!m) return null;
  const points = [Number(m[1]), Number(m[2]), Number(m[3]), Number(m[4])] as const;
  if (points.some((n) => !Number.isFinite(n))) return null;
  return points;
}

function acceptEase(key: string, value: unknown): string | undefined {
  if (typeof value !== "string" || value.trim() === "") {
    warnMotionConfig(
      `ignored ${key}=${JSON.stringify(value)} (GSAP easing is a non-empty string passthrough)`,
    );
    return undefined;
  }
  return value;
}

function acceptPressSqueezeScale(
  value: unknown,
): MotionConfig["pressSqueezeScale"] | undefined {
  if (!Array.isArray(value) || value.length !== 3) {
    warnMotionConfig(
      `ignored pressSqueezeScale=${JSON.stringify(value)} (need [rest, compressed, rest])`,
    );
    return undefined;
  }
  const { min, max } = MOTION_CONFIG_LIMITS.pressSqueezeScale;
  const next: number[] = [];
  for (let i = 0; i < 3; i += 1) {
    const item = value[i];
    if (!isFiniteNumber(item)) {
      warnMotionConfig(
        `ignored pressSqueezeScale=${JSON.stringify(value)} (index ${i} is not a finite number)`,
      );
      return undefined;
    }
    next.push(clamp(item, min, max));
  }
  const tuple = [next[0], next[1], next[2]] as [number, number, number];
  if (tuple[0] !== value[0] || tuple[1] !== value[1] || tuple[2] !== value[2]) {
    warnMotionConfig(
      `clamped pressSqueezeScale from [${value.join(", ")}] to [${tuple.join(", ")}]`,
    );
  }
  return tuple;
}

function acceptRippleEaseCss(value: unknown): string | undefined {
  if (typeof value !== "string" || parseRippleEaseCss(value) == null) {
    warnMotionConfig(
      `ignored rippleEaseCss=${JSON.stringify(value)} (need cubic-bezier(x1, y1, x2, y2))`,
    );
    return undefined;
  }
  return value;
}

/**
 * Validate a `Partial<MotionConfig>` without touching live state.
 * Returns only accepted fields; invalid keys are omitted.
 */
export function normalizeMotionConfig(
  overrides: Partial<MotionConfig>,
): Partial<MotionConfig> {
  const next: Partial<MotionConfig> = {};
  const durationLimit = MOTION_CONFIG_LIMITS.durationMs;
  const scaleLimit = MOTION_CONFIG_LIMITS.scale;
  const opacityLimit = MOTION_CONFIG_LIMITS.opacity;
  const factorLimit = MOTION_CONFIG_LIMITS.factor;

  for (const key of DURATION_KEYS) {
    if (!Object.prototype.hasOwnProperty.call(overrides, key)) continue;
    const accepted = acceptClamped(key, overrides[key], durationLimit.min, durationLimit.max);
    if (accepted !== undefined) next[key] = accepted;
  }

  for (const key of EASE_KEYS) {
    if (!Object.prototype.hasOwnProperty.call(overrides, key)) continue;
    const accepted = acceptEase(key, overrides[key]);
    if (accepted !== undefined) next[key] = accepted;
  }

  for (const key of SCALE_KEYS) {
    if (!Object.prototype.hasOwnProperty.call(overrides, key)) continue;
    const accepted = acceptClamped(key, overrides[key], scaleLimit.min, scaleLimit.max);
    if (accepted !== undefined) next[key] = accepted;
  }

  for (const key of OPACITY_KEYS) {
    if (!Object.prototype.hasOwnProperty.call(overrides, key)) continue;
    const accepted = acceptClamped(key, overrides[key], opacityLimit.min, opacityLimit.max);
    if (accepted !== undefined) next[key] = accepted;
  }

  for (const key of FLAG_KEYS) {
    if (!Object.prototype.hasOwnProperty.call(overrides, key)) continue;
    const value = overrides[key];
    if (typeof value !== "boolean") {
      warnMotionConfig(`ignored ${key}=${JSON.stringify(value)} (need a boolean)`);
      continue;
    }
    next[key] = value;
  }

  if (Object.prototype.hasOwnProperty.call(overrides, "pressSqueezeDurationFactor")) {
    const accepted = acceptClamped(
      "pressSqueezeDurationFactor",
      overrides.pressSqueezeDurationFactor,
      factorLimit.min,
      factorLimit.max,
    );
    if (accepted !== undefined) next.pressSqueezeDurationFactor = accepted;
  }

  if (Object.prototype.hasOwnProperty.call(overrides, "pressSqueezeScale")) {
    const accepted = acceptPressSqueezeScale(overrides.pressSqueezeScale);
    if (accepted !== undefined) next.pressSqueezeScale = accepted;
  }

  if (Object.prototype.hasOwnProperty.call(overrides, "rippleEaseCss")) {
    const accepted = acceptRippleEaseCss(overrides.rippleEaseCss);
    if (accepted !== undefined) next.rippleEaseCss = accepted;
  }

  return next;
}
