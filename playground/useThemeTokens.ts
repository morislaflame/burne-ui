import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  applyColorPresetToState,
  applyThemeModeToState,
} from "./colorPresets";
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
  type ThemeFontWeightKey,
  type ThemeMode,
  type ThemeStatusForegroundKey,
  type ThemeTokenState,
} from "./themeDefaults";

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
  const [state, setState] = useState<ThemeTokenState>(() => createDefaultThemeState("dark"));

  useEffect(() => {
    void applyThemeTokens(state);
  }, [state]);

  useEffect(() => {
    return () => {
      clearThemeInlineTokens();
    };
  }, []);

  const setTheme = useCallback((theme: ThemeMode) => {
    setState((prev) => applyThemeModeToState(prev, theme));
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

  const setFontWeight = useCallback((key: ThemeFontWeightKey, value: number) => {
    setState((prev) => ({
      ...prev,
      fontWeights: { ...prev.fontWeights, [key]: value },
    }));
  }, []);

  const setShadowStrength = useCallback((shadowStrength: number) => {
    setState((prev) => ({ ...prev, shadowStrength }));
  }, []);

  const setShadowSize = useCallback((shadowSize: number) => {
    setState((prev) => ({ ...prev, shadowSize }));
  }, []);

  const setToastScrimSize = useCallback((toastScrimSize: number) => {
    setState((prev) => ({ ...prev, toastScrimSize }));
  }, []);

  const setToastScrimDensity = useCallback((toastScrimDensity: number) => {
    setState((prev) => ({ ...prev, toastScrimDensity }));
  }, []);

  const setMotionDuration = useCallback(
    (
      key:
        | "interactiveDuration"
        | "tooltipDuration"
        | "expandDuration"
        | "progressFillDuration"
        | "loadingDotsDuration",
      value: number,
    ) => {
      setState((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const setAnimationFlag = useCallback(
    (
      key:
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
        | "enableLoadingDots",
      value: boolean,
    ) => {
      setState((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const setColor = useCallback((key: ThemeColorKey, value: string) => {
    setState((prev) => ({
      ...prev,
      colorPreset: null,
      colors: { ...prev.colors, [key]: value },
      ...(key === "border" ? { borderCustomized: true } : {}),
    }));
  }, []);

  const setStatusForeground = useCallback((key: ThemeStatusForegroundKey, value: string) => {
    setState((prev) => ({
      ...prev,
      colorPreset: null,
      statusForegrounds: { ...prev.statusForegrounds, [key]: value },
    }));
  }, []);

  /** Full preset - resets scale and applies the palette to the current theme mode. */
  const applyPreset = useCallback((preset: ColorPresetKey) => {
    setState((prev) => applyColorPresetToState(prev, preset, { resetScale: true }));
  }, []);

  /** Color preset - only colors / statusForegrounds, theme mode does not change. */
  const applyColorPreset = useCallback((preset: ColorPresetKey) => {
    setState((prev) => applyColorPresetToState(prev, preset));
  }, []);

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
    setFontWeight,
    setShadowStrength,
    setShadowSize,
    setToastScrimSize,
    setToastScrimDensity,
    setMotionDuration,
    setAnimationFlag,
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

export type ThemeTokensApi = ReturnType<typeof useThemeTokensState>;
