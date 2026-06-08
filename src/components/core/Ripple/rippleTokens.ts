import { colorToken } from "@/tokens";

/**
 * Именованные заливки converge-ripple (токены темы; `accentMuted` — широкие триггеры).
 * В сторибуке и приложении можно передать ключ в `color` или любую произвольную CSS-строку.
 */
export const RIPPLE_COLOR = {
  accentSolid: colorToken("converge-ripple-accent-fill"),
  accentSoft: colorToken("converge-ripple-accent-soft"),
  secondary: colorToken("converge-ripple-secondary"),
  danger: colorToken("converge-ripple-danger"),
  success: colorToken("converge-ripple-success"),
  info: colorToken("converge-ripple-info"),
  warning: colorToken("converge-ripple-warning"),
  accentMuted: colorToken("converge-ripple-accent-muted"),
} as const;

export type RippleColor = keyof typeof RIPPLE_COLOR;
