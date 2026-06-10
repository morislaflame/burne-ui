import { useCallback, useEffect, useState } from "react";

import {
  applyThemeTokens,
  clearThemeInlineTokens,
  createDefaultThemeState,
  exportThemeCss,
  LAYOUT_PRESETS,
  SCALE_DEFAULTS,
  type ColorPresetKey,
  type LayoutPresetKey,
  type ThemeColorKey,
  type ThemeMode,
  type ThemeStatusForegroundKey,
  type ThemeTokenState,
  THEME_PRESETS,
} from "./themeDefaults";

export function useThemeTokens() {
  const [state, setState] = useState<ThemeTokenState>(() => createDefaultThemeState("dark"));

  useEffect(() => {
    applyThemeTokens(state);
  }, [state]);

  useEffect(() => {
    return () => {
      clearThemeInlineTokens();
    };
  }, []);

  const setTheme = useCallback((theme: ThemeMode) => {
    setState(createDefaultThemeState(theme));
  }, []);

  const setScale = useCallback((key: "space" | "size" | "radius" | "textScale" | "borderWidth", value: number) => {
    setState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setFontFamily = useCallback((fontFamily: string) => {
    setState((prev) => ({ ...prev, fontFamily }));
  }, []);

  const setFontFamilyMono = useCallback((fontFamilyMono: string) => {
    setState((prev) => ({ ...prev, fontFamilyMono }));
  }, []);

  const setShadowStrength = useCallback((shadowStrength: number) => {
    setState((prev) => ({ ...prev, shadowStrength }));
  }, []);

  const setDuration = useCallback((key: "durationFast" | "durationNormal", value: number) => {
    setState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setGlass = useCallback((key: "glassBlur" | "glassSaturate", value: number) => {
    setState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setColor = useCallback((key: ThemeColorKey, value: string) => {
    setState((prev) => ({
      ...prev,
      colors: { ...prev.colors, [key]: value },
    }));
  }, []);

  const setStatusForeground = useCallback((key: ThemeStatusForegroundKey, value: string) => {
    setState((prev) => ({
      ...prev,
      statusForegrounds: { ...prev.statusForegrounds, [key]: value },
    }));
  }, []);

  /** Полный пресет — заменяет всё состояние (для базовых dark/light). */
  const applyPreset = useCallback((preset: keyof typeof THEME_PRESETS) => {
    setState({ ...THEME_PRESETS[preset] });
  }, []);

  /**
   * Цветовой пресет — обновляет только `theme`, `colors`, `statusForegrounds`.
   * Scale-значения (radius, space, size, borderWidth, textScale) не трогает.
   */
  const applyColorPreset = useCallback((preset: ColorPresetKey) => {
    const p = THEME_PRESETS[preset];
    setState((prev) => ({
      ...prev,
      theme: p.theme,
      colors: { ...p.colors },
      statusForegrounds: { ...p.statusForegrounds },
    }));
  }, []);

  /**
   * Лейаут-пресет — обновляет только scale-значения.
   * Цвета и тема не меняются.
   */
  const applyLayoutPreset = useCallback((preset: LayoutPresetKey) => {
    const p = LAYOUT_PRESETS[preset];
    setState((prev) => ({ ...prev, ...p }));
  }, []);

  const reset = useCallback(() => {
    setState(createDefaultThemeState("dark"));
    clearThemeInlineTokens();
  }, []);

  const copyCss = useCallback(async () => {
    const css = exportThemeCss(state);
    await navigator.clipboard.writeText(css);
    return css;
  }, [state]);

  return {
    state,
    setTheme,
    setScale,
    setFontFamily,
    setFontFamilyMono,
    setShadowStrength,
    setDuration,
    setGlass,
    setColor,
    setStatusForeground,
    applyPreset,
    applyColorPreset,
    applyLayoutPreset,
    reset,
    copyCss,
    defaults: SCALE_DEFAULTS,
  };
}

export type ThemeTokensApi = ReturnType<typeof useThemeTokens>;
