/**
 * Centralized animation configuration for Burne UI (GSAP + CSS motion tokens).
 *
 * Call `configureMotion()` once before your app renders to override defaults.
 *
 * @example
 * import { configureMotion } from "burne-ui";
 *
 * configureMotion({
 *   interactiveDuration: 350,
 *   modalDuration: 280,
 *   surfaceTransitionDuration: 450,
 *   toastDismissDuration: 220,
 *   progressIndeterminateDuration: 1500,
 *   selectionFillDuration: 400,
 *   selectionFillEase: "back.out(1.25)",
 *   switchThumbEase: "back.out(1.6)",
 *   enableAnimations: false, // global kill-switch
 * });
 */

/** CSS custom properties written by `applyMotionCssTokens` / theme apply. */
export const MOTION_CSS_VAR = {
  surfaceDuration: "--motion-surface-duration",
} as const;

/** Per-feature enable flags (AND with `enableAnimations`). */
export type MotionFeatureFlag =
  | "enableHoverLift"
  | "enablePressSqueeze"
  | "enableToggleButtonFill"
  | "enableRipple"
  | "enableExpandable"
  | "enableToastStack"
  | "enableAsyncButtonCrossfade"
  | "enableContentFade"
  | "enableFeedbackExpand"
  | "enableProgressFill"
  | "enableLoadingDots"
  | "enableModalMotion"
  | "enableSwitchThumb"
  | "enableTabsIndicator"
  | "enablePaginationFlip"
  | "enableSelectionFill";

export interface MotionConfig {
  /**
   * Duration (ms) for most interactive UI animations:
   * hover-lift, press-squeeze, checkbox, radio, accordion, tab indicator, etc.
   * Modals use `modalDuration`.
   * @default 280
   */
  interactiveDuration: number;

  /**
   * GSAP easing for interactive animations.
   * @default "power2.out"
   */
  interactiveEase: string;

  /**
   * GSAP easing for hover lift (scale lift).
   * Softer than `interactiveEase`: same duration, smoother acceleration/deceleration.
   * @default "sine.inOut"
   */
  hoverLiftEase: string;

  /**
   * Duration (ms) for tooltip / popover / dropdown enter/leave.
   * @default 200
   */
  tooltipDuration: number;

  /**
   * Duration (ms) for Dialog / AlertDialog / Drawer open/close.
   * @default 280
   */
  modalDuration: number;

  /** Switch thumb — how long the travel animation takes (ms). @default 340 */
  switchThumbDuration: number;

  /**
   * GSAP easing for Switch thumb travel (slight overshoot recommended).
   * @default "back.out(1.4)"
   */
  switchThumbEase: string;

  /**
   * GSAP easing for selection fill (ToggleButton, Calendar).
   * @default "back.out(1.25)"
   */
  selectionFillEase: string;

  /**
   * Duration (ms) for selection fill scale animations:
   * ToggleButton, Calendar cell, Checkbox/Radio/ListBox indicator fill, Switch thumb fill.
   * @default 280
   */
  selectionFillDuration: number;

  /** Scale applied when a hoverable element lifts. @default 1.025 */
  hoverLiftScale: number;

  /** Stronger lift scale for `Badge.Anchor` children. @default 1.052 */
  badgeAnchorHoverLiftScale: number;

  /**
   * Three-keyframe scale for press-squeeze: rest → compressed → rest.
   * @default [1, 0.98, 1]
   */
  pressSqueezeScale: readonly [number, number, number];

  /** Duration (ms) of converge-ripple expansion. @default 700 */
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
   * @default 200
   */
  expandDuration: number;

  /**
   * GSAP easing for opening collapsible panels (Expandable, Accordion).
   * @default "sine.inOut"
   */
  expandOpenEase: string;

  /**
   * Duration (ms) for CSS surface / text / shadow / focus-ring transitions
   * (`--motion-surface-duration` → `surface-color-transition`, `animate-shadow`, …).
   * Independent from GSAP `interactiveDuration`.
   * @default 600
   */
  surfaceTransitionDuration: number;

  /**
   * Duration (ms) for Toast dismiss slide + last-scrim fade-out.
   * @default 220
   */
  toastDismissDuration: number;

  /**
   * GSAP easing for Toast dismiss / scrim out.
   * @default "power2.in"
   */
  toastDismissEase: string;

  /**
   * Master kill-switch for all GSAP feature flags.
   * When `false`, every `enable*` feature is treated as off (flags keep their values).
   * @default true
   */
  enableAnimations: boolean;

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

  /**
   * Duration (ms) of one ProgressBar indeterminate loop (translate across track).
   * @default 1500
   */
  progressIndeterminateDuration: number;

  /**
   * GSAP easing for ProgressBar indeterminate loop.
   * @default "expo.inOut"
   */
  progressIndeterminateEase: string;

  /**
   * Duration (ms) of one full Loading dots bounce (up + down).
   * Delay between dots = duration / 3 (wave 1 → 2 → 3).
   * @default 900
   */
  loadingDotsDuration: number;

  /** GSAP easing for Loading dots rise. @default "power2.out" */
  loadingDotsEaseUp: string;

  /** GSAP easing for Loading dots fall. @default "power2.in" */
  loadingDotsEaseDown: string;

  /** Bouncing Loading dots animation (`variant="dots"`). @default true */
  enableLoadingDots: boolean;

  /** Dialog / AlertDialog / Drawer enter/leave. @default true */
  enableModalMotion: boolean;

  /** Switch thumb travel (+ related track fill / icon crossfade). @default true */
  enableSwitchThumb: boolean;

  /** Tabs sliding indicator. @default true */
  enableTabsIndicator: boolean;

  /** Pagination FLIP layout transitions. @default true */
  enablePaginationFlip: boolean;

  /** SelectionIndicator fill / mark (Checkbox, Radio, ListBox, …). @default true */
  enableSelectionFill: boolean;
}

/** Canonical motion defaults — imported by theme `MOTION_DEFAULTS` (single source). */
export const MOTION_CONFIG_DEFAULTS: MotionConfig = {
  interactiveDuration: 280,
  interactiveEase: "power2.out",
  hoverLiftEase: "sine.inOut",
  tooltipDuration: 200,
  modalDuration: 280,
  switchThumbDuration: 340,
  switchThumbEase: "back.out(1.4)",
  selectionFillEase: "back.out(1.25)",
  selectionFillDuration: 280,
  hoverLiftScale: 1.025,
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
  surfaceTransitionDuration: 600,
  toastDismissDuration: 220,
  toastDismissEase: "power2.in",
  enableAnimations: true,
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
  progressIndeterminateDuration: 1500,
  progressIndeterminateEase: "expo.inOut",
  loadingDotsDuration: 900,
  loadingDotsEaseUp: "power2.out",
  loadingDotsEaseDown: "power2.in",
  enableLoadingDots: true,
  enableModalMotion: true,
  enableSwitchThumb: true,
  enableTabsIndicator: true,
  enablePaginationFlip: true,
  enableSelectionFill: true,
};

let _config: MotionConfig = { ...MOTION_CONFIG_DEFAULTS };

let _motionConfigRevision = 0;
const _motionConfigListeners = new Set<() => void>();

/** Subscribe to `configureMotion()` changes (for live GSAP tween rebuild). */
export function subscribeMotionConfig(onStoreChange: () => void): () => void {
  _motionConfigListeners.add(onStoreChange);
  return () => {
    _motionConfigListeners.delete(onStoreChange);
  };
}

/** Motion config revision counter — for `useSyncExternalStore`. */
export function getMotionConfigRevision(): number {
  return _motionConfigRevision;
}

/**
 * Write / clear `--motion-surface-duration` on a root (diff vs kit defaults).
 * Called from `configureMotion` (documentElement) and theme `applyMotionFromState`.
 */
export function applyMotionCssTokens(
  root: HTMLElement | null | undefined,
  config: Pick<MotionConfig, "surfaceTransitionDuration"> = _config,
): void {
  if (typeof document === "undefined") return;
  const target = root ?? document.documentElement;
  const name = MOTION_CSS_VAR.surfaceDuration;
  if (config.surfaceTransitionDuration === MOTION_CONFIG_DEFAULTS.surfaceTransitionDuration) {
    target.style.removeProperty(name);
  } else {
    target.style.setProperty(name, `${config.surfaceTransitionDuration}ms`);
  }
}

/**
 * Override any subset of the global motion config.
 * Call this once before your app renders.
 * Also syncs CSS motion tokens onto `document.documentElement` (unless overridden by theme root).
 */
export function configureMotion(overrides: Partial<MotionConfig>): void {
  _config = { ..._config, ...overrides };
  _motionConfigRevision += 1;
  applyMotionCssTokens(document.documentElement, _config);
  for (const listener of _motionConfigListeners) {
    listener();
  }
}

/** Returns the current (possibly customised) motion config. */
export function getMotionConfig(): Readonly<MotionConfig> {
  return _config;
}

/** Master kill-switch — `false` disables all GSAP feature flags. */
export function isMotionEnabled(): boolean {
  return _config.enableAnimations;
}

/**
 * Whether a feature flag is on under the current master kill-switch.
 * Equivalent to `enableAnimations && config[flag]`.
 */
export function isMotionFeatureEnabled(flag: MotionFeatureFlag): boolean {
  return _config.enableAnimations && _config[flag];
}

/** Returns `{ duration, ease }` for standard interactive GSAP tweens (duration in seconds). */
export function motionInteractive() {
  return {
    duration: _config.interactiveDuration / 1000,
    ease: _config.interactiveEase,
  } as const;
}

/** Dialog / AlertDialog / Drawer enter/leave. */
export function motionModal() {
  return {
    duration: _config.modalDuration / 1000,
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

/** Selection fill (ToggleButton, Calendar, Checkbox/Radio indicator fill). */
export function motionSelectionFill() {
  return {
    duration: _config.selectionFillDuration / 1000,
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

/** Collapsible panel (Expandable, Accordion) — in/out are symmetric. */
export function motionExpand() {
  return {
    duration: _config.expandDuration / 1000,
    ease: _config.expandOpenEase,
  } as const;
}

/** Quick fade (Avatar image, Calendar range tint). */
export function motionContentFade() {
  return {
    duration: _config.tooltipDuration / 1000,
    ease: _config.interactiveEase,
  } as const;
}

/** Feedback-expand ring after async button. Easing — `ensureRippleEase()` at call site. */
export function motionFeedbackExpand() {
  return {
    duration: _config.feedbackExpandDuration / 1000,
  } as const;
}

/** Smooth ProgressBar fill when `value` changes. */
export function motionProgressFill() {
  return {
    duration: _config.progressFillDuration / 1000,
    ease: _config.progressFillEase,
  } as const;
}

/** ProgressBar indeterminate translate loop. */
export function motionProgressIndeterminate() {
  return {
    duration: _config.progressIndeterminateDuration / 1000,
    ease: _config.progressIndeterminateEase,
  } as const;
}

/** Toast dismiss slide + last-scrim fade-out. */
export function motionToastDismiss() {
  return {
    duration: _config.toastDismissDuration / 1000,
    ease: _config.toastDismissEase,
  } as const;
}

const LOADING_DOTS_COUNT = 3;

/** Bouncing Loading dots — wave with fixed step duration / 3. */
export function motionLoadingDots() {
  const cycleSec = _config.loadingDotsDuration / 1000;
  return {
    cycleSec,
    staggerSec: cycleSec / LOADING_DOTS_COUNT,
    halfCycleSec: cycleSec / 2,
    easeUp: _config.loadingDotsEaseUp,
    easeDown: _config.loadingDotsEaseDown,
    enabled: isMotionFeatureEnabled("enableLoadingDots"),
  } as const;
}
