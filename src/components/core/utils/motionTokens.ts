/**
 * Общие параметры анимаций (anime.js + согласованные CSS-где нужно).
 */

import { cubicBezier } from "animejs";

// --- hover lift + press squeeze (интерактивные поверхности) ---

export const MOTION_INTERACTIVE_MS = 280;
export const MOTION_INTERACTIVE_EASE = "out(2)" as const;

/** Fade появление / скрытие Tooltip (portal). */
export const MOTION_TOOLTIP_MS = 200;

export const MOTION_HOVER_LIFT_SCALE = 1.015;

/** Hover-lift прямого `Badge` внутри `Badge.Anchor` — чуть сильнее, чем у кнопок/карт. */
export const MOTION_BADGE_ANCHOR_HOVER_LIFT_SCALE = 1.052;

/** Ключевые кадры squeeze: покой → сжатие → покой */
export const MOTION_PRESS_SQUEEZE_SCALE = [1, 0.98, 1] as const;

// --- converge ripple (точка от пальца) ---

export const MOTION_RIPPLE_DEFAULT_DURATION_MS = 480;
export const MOTION_RIPPLE_DEFAULT_OPACITY_FROM = 0.42;

/** Слегка длиннее/мягче для широкого тригера (Expandable) */
export const MOTION_RIPPLE_EXPANDABLE_DURATION_MS = 640;
export const MOTION_RIPPLE_EXPANDABLE_OPACITY_FROM = 0.34;

/** Easing точки сходимости — тот же профиль, что в CSS keyframes async-ripple у Button */
export const MOTION_RIPPLE_EASE_CSS = "cubic-bezier(0.25, 0.55, 0.35, 0.95)";
export const MOTION_RIPPLE_EASE = cubicBezier(0.25, 0.55, 0.35, 0.95);

/** Круг разлёта success/error после async (чистый CSS в Button) */
export const MOTION_FEEDBACK_EXPAND_MS = 720;
