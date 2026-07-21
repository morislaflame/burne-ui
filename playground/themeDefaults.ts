/**
 * Kit theme primitives for the playground (no named color/font presets).
 * Editor labels live in `./themeEditorChrome`.
 */
export {
  applyThemeTokens,
  clearThemeInlineTokens,
  createDefaultThemeState,
  ensureModePalettes,
  activateThemeModePalette,
  patchThemeColor,
  exportThemeCss,
  COLOR_CSS_VAR,
  DEFAULT_FONT,
  DEFAULT_FONT_MONO,
  FONT_WEIGHT_CSS_VAR,
  FONT_WEIGHT_DEFAULTS,
  MOTION_DEFAULTS,
  SCALE_DEFAULTS,
  TEXT_SCALE_BASES,
  DARK_COLORS,
  LIGHT_COLORS,
  type ThemeColorKey,
  type ThemeColors,
  type ThemeFontWeightKey,
  type ThemeFontWeights,
  type ThemeMode,
  type ThemeStatusForegroundKey,
  type ThemeStatusForegrounds,
  type ThemeTokenState,
} from "../src/theme/themeDefaults";

export {
  ANIMATION_FLAG_LABELS,
  COLOR_LABELS,
  FONT_WEIGHT_LABELS,
  GSAP_EASE_OPTIONS,
  MOTION_DURATION_LABELS,
  MOTION_EASE_LABELS,
  MOTION_SCALE_LABELS,
  RIPPLE_EASE_CSS_OPTIONS,
  SCALE_TOKEN_LABELS,
  STATUS_FOREGROUND_LABELS,
} from "./themeEditorChrome";

import { createDefaultThemeState, type ThemeMode, type ThemeTokenState } from "../src/theme/themeDefaults";

/** Playground/docs editor state — kit tokens + active named color preset id. */
export type ThemeEditorState = ThemeTokenState & {
  colorPreset: string | null;
};

export function createDefaultEditorState(theme: ThemeMode = "dark"): ThemeEditorState {
  return { ...createDefaultThemeState(theme), colorPreset: null };
}
