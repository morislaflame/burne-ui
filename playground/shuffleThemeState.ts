import {
  applyColorPresetToState,
  COLOR_PRESET_DEFINITIONS,
  type ColorPresetKey,
} from "./colorPresets";
import { SCALE_CONTROLS, SHADOW_CONTROLS } from "./themeControlRanges";
import type { ThemeEditorState, ThemeFontWeightKey, ThemeFontWeights } from "./themeDefaults";
import { FONT_PRESETS, MONO_FONT_PRESETS } from "./themePresets";

function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

/** Random value on the same stepped grid as the Scale sliders. */
export function randomSteppedValue(min: number, max: number, step: number): number {
  const steps = Math.max(0, Math.round((max - min) / step));
  const index = Math.floor(Math.random() * (steps + 1));
  const raw = min + index * step;
  const decimals = step < 0.05 ? 3 : step < 1 ? 2 : 0;
  return Number(raw.toFixed(decimals));
}

/** Same options as Typeface selects in ThemeControls. */
const FONT_WEIGHT_OPTIONS = [300, 400, 500, 600, 700, 800] as const;
const FONT_WEIGHT_KEYS = ["small", "base", "mid", "strong", "bold"] as const satisfies readonly ThemeFontWeightKey[];

/** Non-decreasing scale so small → bold stays a usable hierarchy. */
function randomFontWeights(): ThemeFontWeights {
  let minIndex = 0;
  const weights = {} as ThemeFontWeights;
  for (const key of FONT_WEIGHT_KEYS) {
    const index = minIndex + Math.floor(Math.random() * (FONT_WEIGHT_OPTIONS.length - minIndex));
    weights[key] = FONT_WEIGHT_OPTIONS[index]!;
    minIndex = index;
  }
  return weights;
}

const COLOR_PRESET_KEYS = Object.keys(COLOR_PRESET_DEFINITIONS) as ColorPresetKey[];

/**
 * Random color preset + Scale/Shadow tokens + sans/mono fonts + font weights.
 * Motion / animation tokens are left unchanged.
 */
export function shuffleThemeState(prev: ThemeEditorState): ThemeEditorState {
  const withPreset = applyColorPresetToState(prev, pickRandom(COLOR_PRESET_KEYS));

  const scales = Object.fromEntries(
    SCALE_CONTROLS.map(({ key, min, max, shuffleMin, shuffleMax, step }) => [
      key,
      randomSteppedValue(shuffleMin ?? min, shuffleMax ?? max, step),
    ]),
  ) as Pick<ThemeEditorState, (typeof SCALE_CONTROLS)[number]["key"]>;

  const shadows = Object.fromEntries(
    SHADOW_CONTROLS.map(({ key, min, max, shuffleMin, shuffleMax, step }) => [
      key,
      randomSteppedValue(shuffleMin ?? min, shuffleMax ?? max, step),
    ]),
  ) as Pick<ThemeEditorState, (typeof SHADOW_CONTROLS)[number]["key"]>;

  return {
    ...withPreset,
    ...scales,
    ...shadows,
    fontFamily: pickRandom(FONT_PRESETS).value,
    fontFamilyMono: pickRandom(MONO_FONT_PRESETS).value,
    fontWeights: randomFontWeights(),
    themePreset: null,
  };
}
