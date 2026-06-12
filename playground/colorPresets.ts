import {
  createDefaultThemeState,
  isBorderColorCustomized,
  paletteColors,
  type ColorPresetKey,
  type ThemeColors,
  type ThemeMode,
  type ThemeStatusForegrounds,
  type ThemeTokenState,
} from "./themeDefaults";

const P = paletteColors;

export type ColorPresetSlice = {
  colors: ThemeColors;
  statusForegrounds: ThemeStatusForegrounds;
  shadowStrength?: number;
};

export type ColorPresetDefinition = Record<ThemeMode, ColorPresetSlice>;

function def(dark: ColorPresetSlice, light: ColorPresetSlice): ColorPresetDefinition {
  return { dark, light };
}

function withTints(
  colors: Omit<ThemeColors, "primaryTint" | "primaryTintStrong">,
  tintStrong?: string,
): ThemeColors {
  return {
    ...colors,
    primaryTint: P.PRIMARY_TINT,
    primaryTintStrong: tintStrong ?? P.PRIMARY_TINT_STRONG,
  };
}

// ─── Paired variants (light ↔ dark) ───────────────────────────────────────────

const OCEAN_LIGHT_COLORS: ThemeColors = withTints({
  background: "#f0f9ff",
  surface: "#ffffff",
  secondary: "#e0f2fe",
  secondaryForeground: "#0c4a6e",
  tertiary: "#dbeafe",
  tertiaryForeground: "#0c4a6e",
  border: "#bae6fd",
  foreground: "#03131c",
  muted: "#64748b",
  primary: "#0284c7",
  primaryForeground: "#ffffff",
  focusRing: "#0284c7",
  indicator: "#06b6d4",
  indicatorForeground: "#ffffff",
  danger: "#dc2626",
  success: "#22c55e",
  info: "#0ea5e9",
  warning: "#f59e0b",
});

const VIOLET_LIGHT_COLORS: ThemeColors = withTints({
  background: "#faf5ff",
  surface: "#ffffff",
  secondary: "#ede9fe",
  secondaryForeground: "#3b0764",
  tertiary: "#e4d9fc",
  tertiaryForeground: "#3b0764",
  border: "#ddd6fe",
  foreground: "#0e0317",
  muted: "#6b7280",
  primary: "#7c3aed",
  primaryForeground: "#ffffff",
  focusRing: "#7c3aed",
  indicator: "#8b5cf6",
  indicatorForeground: "#ffffff",
  danger: "#dc2626",
  success: "#22c55e",
  info: "#0ea5e9",
  warning: "#f59e0b",
});

const EMERALD_LIGHT_COLORS: ThemeColors = withTints({
  background: "#fafffb",
  surface: "#ffffff",
  secondary: "#dcfce7",
  secondaryForeground: "#064e3b",
  tertiary: "#d1fae5",
  tertiaryForeground: "#064e3b",
  border: "#bbf7d0",
  foreground: "#01130e",
  muted: "#6b7280",
  primary: "#059669",
  primaryForeground: "#ffffff",
  focusRing: "#059669",
  indicator: "#10b981",
  indicatorForeground: "#ffffff",
  danger: "#dc2626",
  success: "#22c55e",
  info: "#0ea5e9",
  warning: "#f59e0b",
});

const ROSE_DARK_COLORS: ThemeColors = withTints({
  background: "#0c0d10",
  surface: "#1a1216",
  secondary: "#2a2228",
  secondaryForeground: "#f4f5f7",
  tertiary: "#332a32",
  tertiaryForeground: "#f4f5f7",
  border: "#4a3540",
  foreground: "#f4f5f7",
  muted: "#a88a94",
  primary: "#f43f5e",
  primaryForeground: "#ffffff",
  focusRing: "#f43f5e",
  indicator: "#e11d48",
  indicatorForeground: "#ffffff",
  danger: "#dc2626",
  success: "#22c55e",
  info: "#0ea5e9",
  warning: "#f59e0b",
});

const AMBER_DARK_COLORS: ThemeColors = withTints({
  background: "#0c0d10",
  surface: "#1a1610",
  secondary: "#2a241c",
  secondaryForeground: "#f4f5f7",
  tertiary: "#332c24",
  tertiaryForeground: "#f4f5f7",
  border: "#4a3d2a",
  foreground: "#f4f5f7",
  muted: "#a89478",
  primary: "#d97706",
  primaryForeground: "#ffffff",
  focusRing: "#d97706",
  indicator: "#b45309",
  indicatorForeground: "#ffffff",
  danger: "#dc2626",
  success: "#22c55e",
  info: "#0ea5e9",
  warning: "#f59e0b",
});

const SLATE_DARK_COLORS: ThemeColors = withTints({
  background: "#0c0d10",
  surface: "#14161f",
  secondary: "#22242e",
  secondaryForeground: "#f4f5f7",
  tertiary: "#2a2d3a",
  tertiaryForeground: "#f4f5f7",
  border: "#3d4250",
  foreground: "#f4f5f7",
  muted: "#8b90a0",
  primary: "#6366f1",
  primaryForeground: "#ffffff",
  focusRing: "#6366f1",
  indicator: "#6366f1",
  indicatorForeground: "#ffffff",
  danger: "#dc2626",
  success: "#22c55e",
  info: "#0ea5e9",
  warning: "#f59e0b",
});

const TOFFEE_DARK_COLORS: ThemeColors = withTints({
  background: "#1a1208",
  surface: "#241a10",
  secondary: "#2e2218",
  secondaryForeground: "#f8f3ee",
  tertiary: "#382a20",
  tertiaryForeground: "#f8f3ee",
  border: "#5c4030",
  foreground: "#f8f3ee",
  muted: "#b08968",
  primary: "#9c6644",
  primaryForeground: "#f8f3ee",
  focusRing: "#9c6644",
  indicator: "#7f5539",
  indicatorForeground: "#f8f3ee",
  danger: "#dc2626",
  success: "#22c55e",
  info: "#0ea5e9",
  warning: "#d97706",
});

const BERRY_DARK_COLORS: ThemeColors = withTints({
  background: "#120408",
  surface: "#1c0a10",
  secondary: "#281218",
  tertiaryForeground: "#f5ece6",
  secondaryForeground: "#f5ece6",
  tertiary: "#321820",
  border: "#5c2838",
  foreground: "#f5ece6",
  muted: "#c97a88",
  primary: "#b6465f",
  primaryForeground: "#ffffff",
  focusRing: "#b6465f",
  indicator: "#890620",
  indicatorForeground: "#ffffff",
  danger: "#dc2626",
  success: "#22c55e",
  info: "#0ea5e9",
  warning: "#d97706",
});

const PAPRIKA_DARK_COLORS: ThemeColors = withTints({
  background: "#120806",
  surface: "#1c1008",
  secondary: "#281810",
  secondaryForeground: "#ede8e2",
  tertiary: "#322018",
  tertiaryForeground: "#ede8e2",
  border: "#5c3828",
  foreground: "#ede8e2",
  muted: "#c49a88",
  primary: "#e16036",
  primaryForeground: "#ffffff",
  focusRing: "#e16036",
  indicator: "#e3170a",
  indicatorForeground: "#ffffff",
  danger: "#dc2626",
  success: "#22c55e",
  info: "#0ea5e9",
  warning: "#d97706",
});

const CHERRY_DARK_COLORS: ThemeColors = withTints({
  background: "#0c0404",
  surface: "#180808",
  secondary: "#241010",
  secondaryForeground: "#fff0ee",
  tertiary: "#301818",
  tertiaryForeground: "#fff0ee",
  border: "#5c2020",
  foreground: "#fff0ee",
  muted: "#c08080",
  primary: "#ad2831",
  primaryForeground: "#ffffff",
  focusRing: "#ad2831",
  indicator: "#800e13",
  indicatorForeground: "#ffffff",
  danger: "#dc2626",
  success: "#22c55e",
  info: "#0ea5e9",
  warning: "#d97706",
});

const RUSTIC_DARK_COLORS: ThemeColors = withTints({
  background: "#141210",
  surface: "#1c1a18",
  secondary: "#262220",
  secondaryForeground: "#fffcf2",
  tertiary: "#302c28",
  tertiaryForeground: "#fffcf2",
  border: "#4a4038",
  foreground: "#fffcf2",
  muted: "#a89888",
  primary: "#eb5e28",
  primaryForeground: "#fffcf2",
  focusRing: "#eb5e28",
  indicator: "#c94a1e",
  indicatorForeground: "#fffcf2",
  danger: "#dc2626",
  success: "#22c55e",
  info: "#0ea5e9",
  warning: "#d97706",
});

const EARTHY_DARK_COLORS: ThemeColors = withTints({
  background: "#12100c",
  surface: "#1a1610",
  secondary: "#242018",
  secondaryForeground: "#f8f4e8",
  tertiary: "#2e2820",
  tertiaryForeground: "#f8f4e8",
  border: "#4a4030",
  foreground: "#f8f4e8",
  muted: "#9a8878",
  primary: "#adc178",
  primaryForeground: "#0d0d0d",
  focusRing: "#adc178",
  indicator: "#6c584c",
  indicatorForeground: "#adc178",
  danger: "#dc2626",
  success: "#adc178",
  info: "#0ea5e9",
  warning: "#d97706",
});

const PEACH_DARK_COLORS: ThemeColors = withTints({
  background: "#141010",
  surface: "#1c1614",
  secondary: "#282018",
  secondaryForeground: "#fff5ee",
  tertiary: "#322820",
  tertiaryForeground: "#fff5ee",
  border: "#5c4038",
  foreground: "#fff5ee",
  muted: "#c99a9a",
  primary: "#f08080",
  primaryForeground: "#ffffff",
  focusRing: "#f08080",
  indicator: "#e06b6b",
  indicatorForeground: "#ffffff",
  danger: "#dc2626",
  success: "#22c55e",
  info: "#0ea5e9",
  warning: "#f59e0b",
});

const SAND_DARK_COLORS: ThemeColors = withTints({
  background: "#141210",
  surface: "#1c1814",
  secondary: "#262018",
  secondaryForeground: "#f5ebe0",
  tertiary: "#302820",
  tertiaryForeground: "#f5ebe0",
  border: "#4a4038",
  foreground: "#f5ebe0",
  muted: "#a89888",
  primary: "#9a846f",
  primaryForeground: "#f5ebe0",
  focusRing: "#9a846f",
  indicator: "#7a6a58",
  indicatorForeground: "#f5ebe0",
  danger: "#dc2626",
  success: "#22c55e",
  info: "#0ea5e9",
  warning: "#d97706",
});

const BOLD_LIGHT_COLORS: ThemeColors = {
  background: "#f8f6ff",
  surface: "#ffffff",
  secondary: "#ede8ff",
  secondaryForeground: "#1e1b4b",
  tertiary: "#e4dcff",
  tertiaryForeground: "#1e1b4b",
  border: "#d4c4ff",
  foreground: "#1e1b4b",
  muted: "#6366a8",
  primary: "#d61f6d",
  primaryForeground: "#ffffff",
  focusRing: "#d61f6d",
  indicator: "#d61f6d",
  indicatorForeground: "#ffffff",
  danger: "#d61f6d",
  success: "#0891b2",
  info: "#4361ee",
  warning: "#ea580c",
  primaryTint: P.BOLD_PRIMARY_TINT,
  primaryTintStrong: P.BOLD_PRIMARY_TINT_STRONG,
};

const AUTUMN_LIGHT_COLORS: ThemeColors = {
  background: "#f4f8fb",
  surface: "#ffffff",
  secondary: "#e8f0f6",
  secondaryForeground: "#01141e",
  tertiary: "#dce8f0",
  tertiaryForeground: "#01141e",
  border: "#b8d4e8",
  foreground: "#01141e",
  muted: "#5c7a8a",
  primary: "#d62828",
  primaryForeground: "#ffffff",
  focusRing: "#d62828",
  indicator: "#d62828",
  indicatorForeground: "#ffffff",
  danger: "#d62828",
  success: "#22c55e",
  info: "#0891b2",
  warning: "#d97706",
  primaryTint: P.AUTUMN_PRIMARY_TINT,
  primaryTintStrong: P.AUTUMN_PRIMARY_TINT_STRONG,
};

const CONTRAST_LIGHT_COLORS: ThemeColors = withTints({
  background: "#ffffff",
  surface: "#f4f5f7",
  secondary: "#e8eaed",
  secondaryForeground: "#0c0c0e",
  tertiary: "#dce0e6",
  tertiaryForeground: "#0c0c0e",
  border: "#c8ccd4",
  foreground: "#0c0c0e",
  muted: "#5c6370",
  primary: "#0c0c0e",
  primaryForeground: "#ffffff",
  focusRing: "#0c0c0e",
  indicator: "#0c0c0e",
  indicatorForeground: "#ffffff",
  danger: "#dc2626",
  success: "#22c55e",
  info: "#0ea5e9",
  warning: "#f59e0b",
});

const BASE_PRESET_DEF = def(
  { colors: P.DARK_COLORS, statusForegrounds: P.DARK_STATUS_FOREGROUNDS },
  { colors: P.LIGHT_COLORS, statusForegrounds: P.LIGHT_STATUS_FOREGROUNDS },
);

export const COLOR_PRESET_DEFINITIONS: Record<ColorPresetKey, ColorPresetDefinition> = {
  dark: BASE_PRESET_DEF,
  light: BASE_PRESET_DEF,
  contrast: def(
    { colors: P.CONTRAST_DARK_COLORS, statusForegrounds: P.DARK_STATUS_FOREGROUNDS, shadowStrength: 1.25 },
    { colors: CONTRAST_LIGHT_COLORS, statusForegrounds: P.LIGHT_STATUS_FOREGROUNDS, shadowStrength: 1.25 },
  ),
  ocean: def(
    { colors: P.OCEAN_DARK_COLORS, statusForegrounds: P.DARK_STATUS_FOREGROUNDS },
    { colors: OCEAN_LIGHT_COLORS, statusForegrounds: P.LIGHT_STATUS_FOREGROUNDS },
  ),
  violet: def(
    { colors: P.VIOLET_DARK_COLORS, statusForegrounds: P.DARK_STATUS_FOREGROUNDS },
    { colors: VIOLET_LIGHT_COLORS, statusForegrounds: P.LIGHT_STATUS_FOREGROUNDS },
  ),
  emerald: def(
    { colors: P.EMERALD_DARK_COLORS, statusForegrounds: P.DARK_STATUS_FOREGROUNDS },
    { colors: EMERALD_LIGHT_COLORS, statusForegrounds: P.LIGHT_STATUS_FOREGROUNDS },
  ),
  rose: def(
    { colors: ROSE_DARK_COLORS, statusForegrounds: P.DARK_STATUS_FOREGROUNDS },
    { colors: P.ROSE_LIGHT_COLORS, statusForegrounds: P.LIGHT_STATUS_FOREGROUNDS },
  ),
  amber: def(
    { colors: AMBER_DARK_COLORS, statusForegrounds: P.DARK_STATUS_FOREGROUNDS },
    { colors: P.AMBER_LIGHT_COLORS, statusForegrounds: P.LIGHT_STATUS_FOREGROUNDS },
  ),
  slate: def(
    { colors: SLATE_DARK_COLORS, statusForegrounds: P.DARK_STATUS_FOREGROUNDS },
    { colors: P.SLATE_LIGHT_COLORS, statusForegrounds: P.LIGHT_STATUS_FOREGROUNDS },
  ),
  toffee: def(
    { colors: TOFFEE_DARK_COLORS, statusForegrounds: P.DARK_STATUS_FOREGROUNDS },
    { colors: P.TOFFEE_LIGHT_COLORS, statusForegrounds: P.LIGHT_STATUS_FOREGROUNDS },
  ),
  berry: def(
    { colors: BERRY_DARK_COLORS, statusForegrounds: P.DARK_STATUS_FOREGROUNDS },
    { colors: P.BERRY_LIGHT_COLORS, statusForegrounds: P.LIGHT_STATUS_FOREGROUNDS },
  ),
  paprika: def(
    { colors: PAPRIKA_DARK_COLORS, statusForegrounds: P.DARK_STATUS_FOREGROUNDS },
    { colors: P.PAPRIKA_LIGHT_COLORS, statusForegrounds: P.LIGHT_STATUS_FOREGROUNDS },
  ),
  cherry: def(
    { colors: CHERRY_DARK_COLORS, statusForegrounds: P.DARK_STATUS_FOREGROUNDS },
    { colors: P.CHERRY_LIGHT_COLORS, statusForegrounds: P.LIGHT_STATUS_FOREGROUNDS },
  ),
  rustic: def(
    { colors: RUSTIC_DARK_COLORS, statusForegrounds: P.DARK_STATUS_FOREGROUNDS },
    { colors: P.RUSTIC_LIGHT_COLORS, statusForegrounds: P.LIGHT_STATUS_FOREGROUNDS },
  ),
  earthy: def(
    { colors: EARTHY_DARK_COLORS, statusForegrounds: P.DARK_STATUS_FOREGROUNDS },
    { colors: P.EARTHY_LIGHT_COLORS, statusForegrounds: P.LIGHT_STATUS_FOREGROUNDS },
  ),
  peach: def(
    { colors: PEACH_DARK_COLORS, statusForegrounds: P.DARK_STATUS_FOREGROUNDS },
    { colors: P.PEACH_LIGHT_COLORS, statusForegrounds: P.LIGHT_STATUS_FOREGROUNDS },
  ),
  sand: def(
    { colors: SAND_DARK_COLORS, statusForegrounds: P.DARK_STATUS_FOREGROUNDS },
    { colors: P.SAND_LIGHT_COLORS, statusForegrounds: P.LIGHT_STATUS_FOREGROUNDS },
  ),
  bold: def(
    {
      colors: P.BOLD_DARK_COLORS,
      statusForegrounds: P.DARK_STATUS_FOREGROUNDS,
    },
    { colors: BOLD_LIGHT_COLORS, statusForegrounds: P.LIGHT_STATUS_FOREGROUNDS },
  ),
  autumn: def(
    {
      colors: P.AUTUMN_DARK_COLORS,
      statusForegrounds: P.DARK_STATUS_FOREGROUNDS,
    },
    { colors: AUTUMN_LIGHT_COLORS, statusForegrounds: P.LIGHT_STATUS_FOREGROUNDS },
  ),
};

export function colorPresetSlice(preset: ColorPresetKey, mode: ThemeMode): ColorPresetSlice {
  return COLOR_PRESET_DEFINITIONS[preset][mode];
}

export function applyColorPresetToState(
  prev: ThemeTokenState,
  preset: ColorPresetKey,
  options?: { resetScale?: boolean },
): ThemeTokenState {
  const slice = colorPresetSlice(preset, prev.theme);
  const base = options?.resetScale ? createDefaultThemeState(prev.theme) : prev;

  return {
    ...base,
    theme: prev.theme,
    colorPreset: preset,
    colors: { ...slice.colors },
    statusForegrounds: { ...slice.statusForegrounds },
    borderCustomized: isBorderColorCustomized(slice.colors, prev.theme),
    ...(slice.shadowStrength !== undefined ? { shadowStrength: slice.shadowStrength } : {}),
  };
}

export function applyThemeModeToState(prev: ThemeTokenState, theme: ThemeMode): ThemeTokenState {
  if (prev.colorPreset != null) {
    const slice = colorPresetSlice(prev.colorPreset, theme);
    return {
      ...prev,
      theme,
      colors: { ...slice.colors },
      statusForegrounds: { ...slice.statusForegrounds },
      borderCustomized: isBorderColorCustomized(slice.colors, theme),
      ...(slice.shadowStrength !== undefined ? { shadowStrength: slice.shadowStrength } : {}),
    };
  }

  return createDefaultThemeState(theme);
}
