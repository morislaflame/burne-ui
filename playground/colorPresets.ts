import {
  activateThemeModePalette,
  createDefaultEditorState,
  ensureModePalettes,
  type ThemeColors,
  type ThemeEditorState,
  type ThemeMode,
} from "./themeDefaults";

import {
  AMBER_DARK_COLORS,
  AMBER_LIGHT_COLORS,
  AUTUMN_DARK_COLORS,
  AUTUMN_LIGHT_COLORS,
  BERRY_DARK_COLORS,
  BERRY_LIGHT_COLORS,
  BOLD_DARK_COLORS,
  BOLD_LIGHT_COLORS,
  CHERRY_DARK_COLORS,
  CHERRY_LIGHT_COLORS,
  CONTRAST_DARK_COLORS,
  CONTRAST_LIGHT_COLORS,
  DARK_COLORS,
  DREAMLAND_DARK_COLORS,
  DREAMLAND_LIGHT_COLORS,
  EARTHY_DARK_COLORS,
  EARTHY_LIGHT_COLORS,
  EMERALD_DARK_COLORS,
  EMERALD_LIGHT_COLORS,
  HARVEST_DARK_COLORS,
  HARVEST_LIGHT_COLORS,
  LAVENDER_DARK_COLORS,
  LAVENDER_LIGHT_COLORS,
  LIGHT_COLORS,
  MYSTIC_DARK_COLORS,
  MYSTIC_LIGHT_COLORS,
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

export type ColorPresetKey =
  | "default"
  | "contrast"
  | "ocean"
  | "violet"
  | "emerald"
  | "rose"
  | "amber"
  | "slate"
  | "toffee"
  | "berry"
  | "paprika"
  | "cherry"
  | "rustic"
  | "earthy"
  | "peach"
  | "sand"
  | "bold"
  | "autumn"
  | "harvest"
  | "mystic"
  | "dreamland"
  | "lavender";

export type ColorPresetSlice = {
  colors: ThemeColors;
  shadowStrength?: number;
};

export type ColorPresetDefinition = Record<ThemeMode, ColorPresetSlice>;

function def(dark: ColorPresetSlice, light: ColorPresetSlice): ColorPresetDefinition {
  return { dark, light };
}

export const COLOR_PRESET_DEFINITIONS: Record<ColorPresetKey, ColorPresetDefinition> = {
  default: def({ colors: DARK_COLORS }, { colors: LIGHT_COLORS }),
  contrast: def(
    { colors: CONTRAST_DARK_COLORS, shadowStrength: 1.25 },
    { colors: CONTRAST_LIGHT_COLORS, shadowStrength: 1.25 },
  ),
  ocean: def({ colors: OCEAN_DARK_COLORS }, { colors: OCEAN_LIGHT_COLORS }),
  violet: def({ colors: VIOLET_DARK_COLORS }, { colors: VIOLET_LIGHT_COLORS }),
  emerald: def({ colors: EMERALD_DARK_COLORS }, { colors: EMERALD_LIGHT_COLORS }),
  rose: def({ colors: ROSE_DARK_COLORS }, { colors: ROSE_LIGHT_COLORS }),
  amber: def({ colors: AMBER_DARK_COLORS }, { colors: AMBER_LIGHT_COLORS }),
  slate: def({ colors: SLATE_DARK_COLORS }, { colors: SLATE_LIGHT_COLORS }),
  toffee: def({ colors: TOFFEE_DARK_COLORS }, { colors: TOFFEE_LIGHT_COLORS }),
  berry: def({ colors: BERRY_DARK_COLORS }, { colors: BERRY_LIGHT_COLORS }),
  paprika: def({ colors: PAPRIKA_DARK_COLORS }, { colors: PAPRIKA_LIGHT_COLORS }),
  cherry: def({ colors: CHERRY_DARK_COLORS }, { colors: CHERRY_LIGHT_COLORS }),
  rustic: def({ colors: RUSTIC_DARK_COLORS }, { colors: RUSTIC_LIGHT_COLORS }),
  earthy: def({ colors: EARTHY_DARK_COLORS }, { colors: EARTHY_LIGHT_COLORS }),
  peach: def({ colors: PEACH_DARK_COLORS }, { colors: PEACH_LIGHT_COLORS }),
  sand: def({ colors: SAND_DARK_COLORS }, { colors: SAND_LIGHT_COLORS }),
  bold: def({ colors: BOLD_DARK_COLORS }, { colors: BOLD_LIGHT_COLORS }),
  autumn: def({ colors: AUTUMN_DARK_COLORS }, { colors: AUTUMN_LIGHT_COLORS }),
  harvest: def({ colors: HARVEST_DARK_COLORS }, { colors: HARVEST_LIGHT_COLORS }),
  mystic: def({ colors: MYSTIC_DARK_COLORS }, { colors: MYSTIC_LIGHT_COLORS }),
  dreamland: def({ colors: DREAMLAND_DARK_COLORS }, { colors: DREAMLAND_LIGHT_COLORS }),
  lavender: def({ colors: LAVENDER_DARK_COLORS }, { colors: LAVENDER_LIGHT_COLORS }),
};

export function colorPresetSlice(preset: ColorPresetKey, mode: ThemeMode): ColorPresetSlice {
  return COLOR_PRESET_DEFINITIONS[preset][mode];
}

export function applyColorPresetToState(
  prev: ThemeEditorState,
  preset: ColorPresetKey,
  options?: { resetScale?: boolean },
): ThemeEditorState {
  const base = options?.resetScale ? createDefaultEditorState(prev.theme) : ensureModePalettes(prev);
  const dark = colorPresetSlice(preset, "dark");
  const light = colorPresetSlice(preset, "light");
  const activeSlice = colorPresetSlice(preset, prev.theme);

  const next: ThemeEditorState = {
    ...base,
    theme: prev.theme,
    colorPreset: preset,
    modePalettes: {
      dark: { ...dark.colors },
      light: { ...light.colors },
    },
    ...(activeSlice.shadowStrength !== undefined ? { shadowStrength: activeSlice.shadowStrength } : {}),
  };

  return { ...activateThemeModePalette(next, prev.theme), colorPreset: preset };
}

export function applyThemeModeToState(prev: ThemeEditorState, theme: ThemeMode): ThemeEditorState {
  const state = ensureModePalettes(prev);

  if (prev.colorPreset != null && prev.colorPreset in COLOR_PRESET_DEFINITIONS) {
    const preset = prev.colorPreset as ColorPresetKey;
    const slice = colorPresetSlice(preset, theme);
    const next = activateThemeModePalette(
      {
        ...state,
        modePalettes: {
          dark: { ...colorPresetSlice(preset, "dark").colors },
          light: { ...colorPresetSlice(preset, "light").colors },
        },
      },
      theme,
    );
    return {
      ...(slice.shadowStrength !== undefined
        ? { ...next, shadowStrength: slice.shadowStrength }
        : next),
      colorPreset: prev.colorPreset,
    };
  }

  return { ...activateThemeModePalette(state, theme), colorPreset: prev.colorPreset };
}
