import { createContext, createElement, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

import { configureMotion } from "../src";
import { applyColorPresetToState, applyThemeModeToState } from "./colorPresets";
import { applyThemeTokens, clearThemeInlineTokens, createDefaultEditorState, exportThemeCss, MOTION_DEFAULTS, SCALE_DEFAULTS, motionConfigFromThemeState, type ThemeColorKey, type ThemeEditorState, type ThemeFontWeightKey, type ThemeMode, type ThemeStatusForegroundKey } from "./themeDefaults";
import { applyThemePresetToState, LAYOUT_PRESETS, type LayoutPresetKey, type ThemePresetKey } from "./themePresets";
import type { ColorPresetKey } from "./colorPresets";
import { shuffleThemeState } from "./shuffleThemeState";

const ThemeTokensContext = createContext<ThemeTokensApi | null>(null);

export function ThemeTokensProvider({ children }: { children: ReactNode }) {
  const api = useThemeTokensState();
  return createElement(ThemeTokensContext.Provider, { value: api }, children);
}

export function useThemeTokens(): ThemeTokensApi {
  const ctx = useContext(ThemeTokensContext);
  if (!ctx) {
    throw new Error("useThemeTokens must be inside ThemeTokensProvider.");
  }
  return ctx;
}

function useThemeTokensState() {
  const [state, setState] = useState<ThemeEditorState>(() => createDefaultEditorState("dark"));

  useEffect(() => {
    void applyThemeTokens(state);
    configureMotion(motionConfigFromThemeState(state));
  }, [state]);

  useEffect(() => {
    return () => {
      clearThemeInlineTokens();
    };
  }, []);

  const setTheme = useCallback((theme: ThemeMode) => {
    setState((prev) => applyThemeModeToState(prev, theme));
  }, []);

  const setScale = useCallback((key: "space" | "size" | "radius" | "textScale" | "letterSpacing" | "borderWidth" | "focusRingWidth" | "focusRingOffset", value: number) => {
    setState((prev) => ({ ...prev, [key]: value, themePreset: null }));
  }, []);

  const setFontFamily = useCallback((fontFamily: string) => {
    setState((prev) => ({ ...prev, fontFamily, themePreset: null }));
  }, []);

  const setFontFamilyMono = useCallback((fontFamilyMono: string) => {
    setState((prev) => ({ ...prev, fontFamilyMono, themePreset: null }));
  }, []);

  const setFontWeight = useCallback((key: ThemeFontWeightKey, value: number) => {
    setState((prev) => ({
      ...prev,
      themePreset: null,
      fontWeights: { ...prev.fontWeights, [key]: value },
    }));
  }, []);

  const setShadowOpacity = useCallback((shadowOpacity: number) => {
    setState((prev) => ({ ...prev, shadowOpacity, themePreset: null }));
  }, []);

  const setShadowBlur = useCallback((shadowBlur: number) => {
    setState((prev) => ({ ...prev, shadowBlur, themePreset: null }));
  }, []);

  const setShadowSpread = useCallback((shadowSpread: number) => {
    setState((prev) => ({ ...prev, shadowSpread, themePreset: null }));
  }, []);

  const setShadowOffsetX = useCallback((shadowOffsetX: number) => {
    setState((prev) => ({ ...prev, shadowOffsetX, themePreset: null }));
  }, []);

  const setShadowOffsetY = useCallback((shadowOffsetY: number) => {
    setState((prev) => ({ ...prev, shadowOffsetY, themePreset: null }));
  }, []);

  const setToastScrimSize = useCallback((toastScrimSize: number) => {
    setState((prev) => ({ ...prev, toastScrimSize, themePreset: null }));
  }, []);

  const setToastScrimDensity = useCallback((toastScrimDensity: number) => {
    setState((prev) => ({ ...prev, toastScrimDensity, themePreset: null }));
  }, []);

  const setMotionDuration = useCallback(
    (
      key:
        | "interactiveDuration"
        | "modalDuration"
        | "tooltipDuration"
        | "expandDuration"
        | "progressFillDuration"
        | "progressIndeterminateDuration"
        | "loadingDotsDuration"
        | "surfaceTransitionDuration"
        | "toastDismissDuration"
        | "pressSqueezeDurationFactor",
      value: number,
    ) => {
      setState((prev) => ({ ...prev, [key]: value, themePreset: null }));
    },
    [],
  );

  const setAnimationFlag = useCallback(
    (
      key:
        | "enableAnimations"
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
        | "enableSelectionFill",
      value: boolean,
    ) => {
      setState((prev) => ({ ...prev, [key]: value, themePreset: null }));
    },
    [],
  );

  const setColor = useCallback((key: ThemeColorKey, value: string) => {
    setState((prev) => ({
      ...prev,
      colorPreset: null,
      themePreset: null,
      colors: { ...prev.colors, [key]: value },
      modePalettes: {
        ...prev.modePalettes,
        [prev.theme]: { ...prev.colors, [key]: value },
      },
    }));
  }, []);

  const setStatusForeground = useCallback((key: ThemeStatusForegroundKey, value: string) => {
    setColor(key, value);
  }, [setColor]);

  /** Full preset - resets scale and applies the palette to the current theme mode. */
  const applyPreset = useCallback((preset: ColorPresetKey) => {
    setState((prev) => applyColorPresetToState(prev, preset, { resetScale: true }));
  }, []);

  /** Color preset — only palettes; theme mode does not change. */
  const applyColorPreset = useCallback((preset: ColorPresetKey) => {
    setState((prev) => applyColorPresetToState(prev, preset));
  }, []);

  /** Full theme preset — colors + all non-color knobs (scale/fonts/shadows/motion/flags). */
  const applyThemePreset = useCallback((preset: ThemePresetKey) => {
    setState((prev) => applyThemePresetToState(prev, preset));
  }, []);

  const applyLayoutPreset = useCallback((preset: LayoutPresetKey) => {
    const p = LAYOUT_PRESETS[preset];
    setState((prev) => ({ ...prev, ...p, themePreset: null }));
  }, []);

  const reset = useCallback(() => {
    setState(createDefaultEditorState("dark"));
    clearThemeInlineTokens();
  }, []);

  const shuffle = useCallback(() => {
    setState((prev) => shuffleThemeState(prev));
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
    setFontWeight,
    setShadowOpacity,
    setShadowBlur,
    setShadowSpread,
    setShadowOffsetX,
    setShadowOffsetY,
    setToastScrimSize,
    setToastScrimDensity,
    setMotionDuration,
    setAnimationFlag,
    setColor,
    setStatusForeground,
    applyPreset,
    applyColorPreset,
    applyThemePreset,
    applyLayoutPreset,
    reset,
    shuffle,
    copyCss,
    defaults: { ...SCALE_DEFAULTS, ...MOTION_DEFAULTS },
  };
}

export type ThemeTokensApi = ReturnType<typeof useThemeTokensState>;
