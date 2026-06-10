/**
 * Centralized animation configuration for Burne UI.
 *
 * Call `configureMotion()` once before your app renders to override defaults.
 *
 * @example
 * import { configureMotion } from "burne-ui";
 *
 * configureMotion({
 *   interactiveDuration: 350,
 *   switchThumb: { ease: { stiffness: 180, damping: 22, mass: 0.6 } },
 * });
 */

import { spring } from "animejs";

// ─── Spring params ────────────────────────────────────────────────────────────

/** Parameters passed to animejs `spring()`. */
export interface SpringParams {
  stiffness: number;
  damping: number;
  mass: number;
}

// ─── Config shape ─────────────────────────────────────────────────────────────

export interface MotionConfig {
  /**
   * Duration (ms) for most interactive UI animations:
   * hover-lift, press-squeeze, dialogs, drawer slide,
   * checkbox, radio, accordion, tab indicator, etc.
   * @default 280
   */
  interactiveDuration: number;

  /**
   * Easing for interactive animations (animejs syntax).
   * @default "out(2)"
   */
  interactiveEase: string;

  /**
   * Duration (ms) for tooltip / popover / dropdown enter/leave.
   * @default 200
   */
  tooltipDuration: number;

  /** Switch thumb — how long the travel animation takes (ms). @default 340 */
  switchThumbDuration: number;

  /**
   * Switch thumb easing.
   * Pass a `SpringParams` object for a spring animation,
   * or an animejs easing string (e.g. `"out(3)"`) for a regular ease.
   * @default { stiffness: 200, damping: 27, mass: 0.55 }
   */
  switchThumbEase: SpringParams | string;

  /** Scale applied when a hoverable element lifts. @default 1.015 */
  hoverLiftScale: number;

  /** Stronger lift scale for `Badge.Anchor` children. @default 1.052 */
  badgeAnchorHoverLiftScale: number;

  /**
   * Three-keyframe scale for press-squeeze: rest → compressed → rest.
   * @default [1, 0.98, 1]
   */
  pressSqueezeScale: readonly [number, number, number];

  /** Duration (ms) of converge-ripple expansion. @default 540 */
  rippleDefaultDuration: number;

  /** Starting opacity of converge-ripple. @default 0.42 */
  rippleDefaultOpacityFrom: number;

  /** Longer ripple for wide triggers (Expandable). @default 700 */
  rippleExpandableDuration: number;

  /** Starting opacity for wide-trigger ripple. @default 0.34 */
  rippleExpandableOpacityFrom: number;

  /**
   * CSS easing string used in keyframe animations (button async-ripple).
   * @default "cubic-bezier(0.25, 0.55, 0.35, 0.95)"
   */
  rippleEaseCss: string;

  /** Duration (ms) of the feedback-expand ring after async button. @default 720 */
  feedbackExpandDuration: number;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULTS: MotionConfig = {
  interactiveDuration: 280,
  interactiveEase: "out(2)",
  tooltipDuration: 200,
  switchThumbDuration: 340,
  switchThumbEase: { stiffness: 200, damping: 27, mass: 0.55 },
  hoverLiftScale: 1.015,
  badgeAnchorHoverLiftScale: 1.052,
  pressSqueezeScale: [1, 0.98, 1],
  rippleDefaultDuration: 540,
  rippleDefaultOpacityFrom: 0.42,
  rippleExpandableDuration: 700,
  rippleExpandableOpacityFrom: 0.34,
  rippleEaseCss: "cubic-bezier(0.25, 0.55, 0.35, 0.95)",
  feedbackExpandDuration: 720,
};

// ─── Mutable config state ─────────────────────────────────────────────────────

let _config: MotionConfig = { ...DEFAULTS };

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Override any subset of the global motion config.
 * Call this once before your app renders.
 */
export function configureMotion(overrides: Partial<MotionConfig>): void {
  _config = { ..._config, ...overrides };
}

/** Returns the current (possibly customised) motion config. */
export function getMotionConfig(): Readonly<MotionConfig> {
  return _config;
}

// ─── Derived helpers (called at animation time, not module-load time) ─────────

/** Returns `{ duration, ease }` for standard interactive animations. */
export function motionInteractive() {
  return {
    duration: _config.interactiveDuration,
    ease: _config.interactiveEase,
  } as const;
}

/** Returns `{ duration, ease }` for tooltip / popover animations. */
export function motionTooltip() {
  return {
    duration: _config.tooltipDuration,
    ease: _config.interactiveEase,
  } as const;
}

/**
 * Returns `{ duration, ease }` for the Switch thumb animation.
 * The ease is either a built `spring()` object or the raw string from config.
 */
export function motionSwitchThumb() {
  const ease =
    typeof _config.switchThumbEase === "string"
      ? _config.switchThumbEase
      : spring({ ..._config.switchThumbEase, duration: _config.switchThumbDuration });
  return { duration: _config.switchThumbDuration, ease } as const;
}
