/**
 * Centralized animation configuration for Burne UI (GSAP).
 *
 * Call `configureMotion()` once before your app renders to override defaults.
 *
 * @example
 * import { configureMotion } from "burne-ui";
 *
 * configureMotion({
 *   interactiveDuration: 350,
 *   switchThumbEase: "back.out(1.6)",
 * });
 */

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
   * GSAP easing for interactive animations.
   * @default "power2.out"
   */
  interactiveEase: string;

  /**
   * GSAP easing для hover-подъёма (scale lift).
   * Мягче `interactiveEase`: та же длительность, плавнее разгон/замедление.
   * @default "sine.inOut"
   */
  hoverLiftEase: string;

  /**
   * Duration (ms) for tooltip / popover / dropdown enter/leave.
   * @default 200
   */
  tooltipDuration: number;

  /** Switch thumb — how long the travel animation takes (ms). @default 340 */
  switchThumbDuration: number;

  /**
   * GSAP easing for Switch thumb travel (slight overshoot recommended).
   * @default "back.out(1.4)"
   */
  switchThumbEase: string;

  /**
   * GSAP easing для заливки selection (ToggleButton, Calendar).
   * @default "back.out(1.25)"
   */
  selectionFillEase: string;

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
   * Also used to build GSAP CustomEase for converge-ripple.
   * @default "cubic-bezier(0.25, 0.55, 0.35, 0.95)"
   */
  rippleEaseCss: string;

  /** Duration (ms) of the feedback-expand ring after async button. @default 720 */
  feedbackExpandDuration: number;

  /**
   * Duration (ms) for Expandable / Accordion panel height animation.
   * @default 500
   */
  expandDuration: number;

  /**
   * GSAP easing for opening collapsible panels (Expandable, Accordion).
   * @default "power1.inOut"
   */
  expandOpenEase: string;

  /** Whether to enable hover-lift animations globally. @default true */
  enableHoverLift: boolean;

  /** Whether to enable press-squeeze animations globally. @default true */
  enablePressSqueeze: boolean;

  /** Whether to enable toggle button and calendar cell fill animations globally. @default true */
  enableToggleButtonFill: boolean;

  /** Whether to enable ripple animations globally. @default true */
  enableRipple: boolean;

  /** Expandable / Accordion panel height + chevron rotation. @default true */
  enableExpandable: boolean;

  /** Toast stack repositioning (transform / opacity / height). @default true */
  enableToastStack: boolean;

  /** Button async state crossfade (label ↔ loader ↔ success/error). @default true */
  enableAsyncButtonCrossfade: boolean;

  /** Content fade-in (e.g. Avatar image load). @default true */
  enableContentFade: boolean;

  /** Async button success/error expand ring. @default true */
  enableFeedbackExpand: boolean;

  /** Duration (ms) for ProgressBar fill when `value` changes. @default 600 */
  progressFillDuration: number;

  /**
   * GSAP easing for ProgressBar fill animation.
   * @default "power2.out"
   */
  progressFillEase: string;

  /** Animate ProgressBar fill on value change. @default true */
  enableProgressFill: boolean;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULTS: MotionConfig = {
  interactiveDuration: 280,
  interactiveEase: "power2.out",
  hoverLiftEase: "sine.inOut",
  tooltipDuration: 200,
  switchThumbDuration: 340,
  switchThumbEase: "back.out(1.4)",
  selectionFillEase: "back.out(1.25)",
  hoverLiftScale: 1.015,
  badgeAnchorHoverLiftScale: 1.052,
  pressSqueezeScale: [1, 0.98, 1],
  rippleDefaultDuration: 700,
  rippleDefaultOpacityFrom: 0.42,
  rippleExpandableDuration: 700,
  rippleExpandableOpacityFrom: 0.34,
  rippleEaseCss: "cubic-bezier(0.25, 0.55, 0.35, 0.95)",
  feedbackExpandDuration: 720,
  expandDuration: 200,
  expandOpenEase: "sine.inOut",
  enableHoverLift: true,
  enablePressSqueeze: true,
  enableToggleButtonFill: true,
  enableRipple: true,
  enableExpandable: true,
  enableToastStack: true,
  enableAsyncButtonCrossfade: true,
  enableContentFade: true,
  enableFeedbackExpand: true,
  progressFillDuration: 600,
  progressFillEase: "power2.out",
  enableProgressFill: true,
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

/** Returns `{ duration, ease }` for standard interactive GSAP tweens (duration in seconds). */
export function motionInteractive() {
  return {
    duration: _config.interactiveDuration / 1000,
    ease: _config.interactiveEase,
  } as const;
}

/** Returns `{ duration, ease }` for hover-lift GSAP tweens (duration in seconds). */
export function motionHoverLift() {
  return {
    duration: _config.interactiveDuration / 1000,
    ease: _config.hoverLiftEase,
  } as const;
}

/** Заливка selection (ToggleButton, календарь) — in/out симметричны. */
export function motionSelectionFill() {
  return {
    duration: (_config.interactiveDuration * 1.15) / 1000,
    ease: _config.selectionFillEase,
  } as const;
}

/** Returns `{ duration, ease }` for tooltip / popover GSAP tweens (duration in seconds). */
export function motionTooltip() {
  return {
    duration: _config.tooltipDuration / 1000,
    ease: _config.interactiveEase,
  } as const;
}

/** Returns `{ duration, ease }` for the Switch thumb GSAP tween (duration in seconds). */
export function motionSwitchThumb() {
  return {
    duration: _config.switchThumbDuration / 1000,
    ease: _config.switchThumbEase,
  } as const;
}

/** Collapsible-панель (Expandable, Accordion) — in/out симметричны. */
export function motionExpand() {
  return {
    duration: _config.expandDuration / 1000,
    ease: _config.expandOpenEase,
  } as const;
}

/** Быстрый fade (Avatar image, Calendar range tint). */
export function motionContentFade() {
  return {
    duration: _config.tooltipDuration / 1000,
    ease: _config.interactiveEase,
  } as const;
}

/** Feedback-expand ring после async-кнопки. Easing — `ensureRippleEase()` в месте вызова. */
export function motionFeedbackExpand() {
  return {
    duration: _config.feedbackExpandDuration / 1000,
  } as const;
}

/** Плавное заполнение ProgressBar при изменении `value`. */
export function motionProgressFill() {
  return {
    duration: _config.progressFillDuration / 1000,
    ease: _config.progressFillEase,
  } as const;
}
