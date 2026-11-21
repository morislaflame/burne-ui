import { createDefaultThemeState, type ThemeMode, type ThemeTokenState } from "@/theme/themeDefaults";

/** Editor state: kit tokens plus the active named preset ids. */
export type ThemeEditorState = ThemeTokenState & {
  colorPreset: string | null;
  themePreset: string | null;
};

export function createDefaultEditorState(theme: ThemeMode = "dark"): ThemeEditorState {
  return { ...createDefaultThemeState(theme), colorPreset: null, themePreset: null };
}
