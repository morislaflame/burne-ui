/**
 * Общие параметры анимаций (anime.js + согласованные CSS-где нужно).
 *
 * @deprecated Константы здесь — значения по умолчанию (backward compat).
 * Для live-значений используйте `getMotionConfig()` / `configureMotion()`.
 */

import { cubicBezier, spring } from "animejs";

export {
  configureMotion,
  getMotionConfig,
  motionInteractive,
  motionTooltip,
  motionSwitchThumb,
  type MotionConfig,
  type SpringParams,
} from "./motionConfig";

// --- backward-compat constants (equal to defaults in motionConfig) ---

export const MOTION_INTERACTIVE_MS = 280;
export const MOTION_INTERACTIVE_EASE = "out(2)" as const;

/** @deprecated Use `configureMotion` + `getMotionConfig().tooltipDuration`. */
export const MOTION_TOOLTIP_MS = 200;

/** @deprecated Only used internally by the legacy spring constant below. */
export const MOTION_COLOR_CHANGE_MS = 200;

/** Лёгкий overshoot кружка Switch при переключении. */
export const MOTION_SWITCH_THUMB_MS = 340;

/**
 * @deprecated Module-level spring — built once at load time.
 * Use `motionSwitchThumb()` to get a dynamically configured spring.
 */
export const MOTION_SWITCH_THUMB_EASE = spring({
  stiffness: 200,
  damping: 27,
  mass: 0.55,
  duration: MOTION_SWITCH_THUMB_MS,
});

export const MOTION_HOVER_LIFT_SCALE = 1.015;

/** Hover-lift прямого `Badge` внутри `Badge.Anchor` — чуть сильнее, чем у кнопок/карт. */
export const MOTION_BADGE_ANCHOR_HOVER_LIFT_SCALE = 1.052;

/** Ключевые кадры squeeze: покой → сжатие → покой */
export const MOTION_PRESS_SQUEEZE_SCALE = [1, 0.98, 1] as const;

// --- converge ripple (точка от пальца) ---

/** Нижняя граница масштаба: круг не сходится в математическую точку, остаётся мягкое «ядро». */
export const MOTION_RIPPLE_MIN_SCALE = 0.12;

export const MOTION_RIPPLE_DEFAULT_DURATION_MS = 540;
export const MOTION_RIPPLE_DEFAULT_OPACITY_FROM = 0.42;

/** Слегка длиннее/мягче для широкого тригера (Expandable) */
export const MOTION_RIPPLE_EXPANDABLE_DURATION_MS = 700;
export const MOTION_RIPPLE_EXPANDABLE_OPACITY_FROM = 0.34;

/** Easing точки сходимости — тот же профиль, что в CSS keyframes async-ripple у Button */
export const MOTION_RIPPLE_EASE_CSS = "cubic-bezier(0.25, 0.55, 0.35, 0.95)";
export const MOTION_RIPPLE_EASE = cubicBezier(0.25, 0.55, 0.35, 0.95);

/** Круг разлёта success/error после async (чистый CSS в Button) */
export const MOTION_FEEDBACK_EXPAND_MS = 720;
