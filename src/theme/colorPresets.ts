import {
  AMBER_DARK_COLORS,
  AMBER_LIGHT_COLORS,
  AUTUMN_DARK_COLORS,
  AUTUMN_LIGHT_COLORS,
  HARVEST_DARK_COLORS,
  HARVEST_LIGHT_COLORS,
  MYSTIC_DARK_COLORS,
  MYSTIC_LIGHT_COLORS,
  BERRY_DARK_COLORS,
  BERRY_LIGHT_COLORS,
  BOLD_DARK_COLORS,
  BOLD_LIGHT_COLORS,
  CHERRY_DARK_COLORS,
  CHERRY_LIGHT_COLORS,
  CONTRAST_DARK_COLORS,
  CONTRAST_LIGHT_COLORS,
  DARK_COLORS,
  DARK_STATUS_FOREGROUNDS,
  EARTHY_DARK_COLORS,
  EARTHY_LIGHT_COLORS,
  EMERALD_DARK_COLORS,
  EMERALD_LIGHT_COLORS,
  LIGHT_COLORS,
  LIGHT_STATUS_FOREGROUNDS,
  OCEAN_DARK_COLORS,
  OCEAN_LIGHT_COLORS,
  PAPRIKA_DARK_COLORS,
  PAPRIKA_LIGHT_COLORS,
  PEACH_DARK_COLORS,
  PEACH_LIGHT_COLORS,
  ROSE_DARK_COLORS,
  ROSE_LIGHT_COLORS,
  RUSTIC_DARK_COLORS,
  RUSTIC_LIGHT_COLORS,
  SAND_DARK_COLORS,
  SAND_LIGHT_COLORS,
  SLATE_DARK_COLORS,
  SLATE_LIGHT_COLORS,
  TOFFEE_DARK_COLORS,
  TOFFEE_LIGHT_COLORS,
  VIOLET_DARK_COLORS,
  VIOLET_LIGHT_COLORS,
} from "./themePalettes";
import {
  createDefaultThemeState,
  isBorderColorCustomized,
  type ColorPresetKey,
  type ThemeColors,
  type ThemeMode,
  type ThemeStatusForegrounds,
  type ThemeTokenState,
} from "./themeDefaults";

export type ColorPresetSlice = {
  colors: ThemeColors;
  statusForegrounds: ThemeStatusForegrounds;
  shadowStrength?: number;
};

export type ColorPresetDefinition = Record<ThemeMode, ColorPresetSlice>;

function def(dark: ColorPresetSlice, light: ColorPresetSlice): ColorPresetDefinition {
  return { dark, light };
}

const BASE_PRESET_DEF = def(
  { colors: DARK_COLORS, statusForegrounds: DARK_STATUS_FOREGROUNDS },
  { colors: LIGHT_COLORS, statusForegrounds: LIGHT_STATUS_FOREGROUNDS },
);

export const COLOR_PRESET_DEFINITIONS: Record<ColorPresetKey, ColorPresetDefinition> = {
  default: BASE_PRESET_DEF,
  contrast: def(
    { colors: CONTRAST_DARK_COLORS, statusForegrounds: DARK_STATUS_FOREGROUNDS, shadowStrength: 1.25 },
    { colors: CONTRAST_LIGHT_COLORS, statusForegrounds: LIGHT_STATUS_FOREGROUNDS, shadowStrength: 1.25 },
  ),
  ocean: def(
    { colors: OCEAN_DARK_COLORS, statusForegrounds: DARK_STATUS_FOREGROUNDS },
    { colors: OCEAN_LIGHT_COLORS, statusForegrounds: LIGHT_STATUS_FOREGROUNDS },
  ),
  violet: def(
    { colors: VIOLET_DARK_COLORS, statusForegrounds: DARK_STATUS_FOREGROUNDS },
    { colors: VIOLET_LIGHT_COLORS, statusForegrounds: LIGHT_STATUS_FOREGROUNDS },
  ),
  emerald: def(
    { colors: EMERALD_DARK_COLORS, statusForegrounds: DARK_STATUS_FOREGROUNDS },
    { colors: EMERALD_LIGHT_COLORS, statusForegrounds: LIGHT_STATUS_FOREGROUNDS },
  ),
  rose: def(
    { colors: ROSE_DARK_COLORS, statusForegrounds: DARK_STATUS_FOREGROUNDS },
    { colors: ROSE_LIGHT_COLORS, statusForegrounds: LIGHT_STATUS_FOREGROUNDS },
  ),
  amber: def(
    { colors: AMBER_DARK_COLORS, statusForegrounds: DARK_STATUS_FOREGROUNDS },
    { colors: AMBER_LIGHT_COLORS, statusForegrounds: LIGHT_STATUS_FOREGROUNDS },
  ),
  slate: def(
    { colors: SLATE_DARK_COLORS, statusForegrounds: DARK_STATUS_FOREGROUNDS },
    { colors: SLATE_LIGHT_COLORS, statusForegrounds: LIGHT_STATUS_FOREGROUNDS },
  ),
  toffee: def(
    { colors: TOFFEE_DARK_COLORS, statusForegrounds: DARK_STATUS_FOREGROUNDS },
    { colors: TOFFEE_LIGHT_COLORS, statusForegrounds: LIGHT_STATUS_FOREGROUNDS },
  ),
  berry: def(
    { colors: BERRY_DARK_COLORS, statusForegrounds: DARK_STATUS_FOREGROUNDS },
    { colors: BERRY_LIGHT_COLORS, statusForegrounds: LIGHT_STATUS_FOREGROUNDS },
  ),
  paprika: def(
    { colors: PAPRIKA_DARK_COLORS, statusForegrounds: DARK_STATUS_FOREGROUNDS },
    { colors: PAPRIKA_LIGHT_COLORS, statusForegrounds: LIGHT_STATUS_FOREGROUNDS },
  ),
  cherry: def(
    { colors: CHERRY_DARK_COLORS, statusForegrounds: DARK_STATUS_FOREGROUNDS },
    { colors: CHERRY_LIGHT_COLORS, statusForegrounds: LIGHT_STATUS_FOREGROUNDS },
  ),
  rustic: def(
    { colors: RUSTIC_DARK_COLORS, statusForegrounds: DARK_STATUS_FOREGROUNDS },
    { colors: RUSTIC_LIGHT_COLORS, statusForegrounds: LIGHT_STATUS_FOREGROUNDS },
  ),
  earthy: def(
    { colors: EARTHY_DARK_COLORS, statusForegrounds: DARK_STATUS_FOREGROUNDS },
    { colors: EARTHY_LIGHT_COLORS, statusForegrounds: LIGHT_STATUS_FOREGROUNDS },
  ),
  peach: def(
    { colors: PEACH_DARK_COLORS, statusForegrounds: DARK_STATUS_FOREGROUNDS },
    { colors: PEACH_LIGHT_COLORS, statusForegrounds: LIGHT_STATUS_FOREGROUNDS },
  ),
  sand: def(
    { colors: SAND_DARK_COLORS, statusForegrounds: DARK_STATUS_FOREGROUNDS },
    { colors: SAND_LIGHT_COLORS, statusForegrounds: LIGHT_STATUS_FOREGROUNDS },
  ),
  bold: def(
    { colors: BOLD_DARK_COLORS, statusForegrounds: DARK_STATUS_FOREGROUNDS },
    { colors: BOLD_LIGHT_COLORS, statusForegrounds: LIGHT_STATUS_FOREGROUNDS },
  ),
  autumn: def(
    { colors: AUTUMN_DARK_COLORS, statusForegrounds: DARK_STATUS_FOREGROUNDS },
    { colors: AUTUMN_LIGHT_COLORS, statusForegrounds: LIGHT_STATUS_FOREGROUNDS },
  ),
  harvest: def(
    { colors: HARVEST_DARK_COLORS, statusForegrounds: DARK_STATUS_FOREGROUNDS },
    { colors: HARVEST_LIGHT_COLORS, statusForegrounds: LIGHT_STATUS_FOREGROUNDS },
  ),
  mystic: def(
    { colors: MYSTIC_DARK_COLORS, statusForegrounds: DARK_STATUS_FOREGROUNDS },
    { colors: MYSTIC_LIGHT_COLORS, statusForegrounds: LIGHT_STATUS_FOREGROUNDS },
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
    borderCustomized: isBorderColorCustomized(slice.colors),
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
      borderCustomized: isBorderColorCustomized(slice.colors),
      ...(slice.shadowStrength !== undefined ? { shadowStrength: slice.shadowStrength } : {}),
    };
  }

  return createDefaultThemeState(theme);
}
