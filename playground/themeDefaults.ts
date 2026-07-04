export type ThemeMode = "dark" | "light";

import {
  BORDER_COLOR_CSS_FORMULA,
  DARK_COLORS,
  LIGHT_COLORS,
  DARK_STATUS_FOREGROUNDS,
  LIGHT_STATUS_FOREGROUNDS,
} from "./themePalettes";
import {
  FONT_WEIGHT_CSS_VAR,
  FONT_WEIGHT_DEFAULTS,
  type FontWeightStep,
} from "../src/tokens/fontWeights";

export { FONT_WEIGHT_DEFAULTS };

export {
  BORDER_COLOR_CSS_FORMULA,
  DARK_COLORS,
  LIGHT_COLORS,
  DARK_STATUS_FOREGROUNDS,
  LIGHT_STATUS_FOREGROUNDS,
};

export type ThemeColorKey =
  | "background"
  | "surface"
  | "secondary"
  | "secondaryForeground"
  | "tertiary"
  | "tertiaryForeground"
  | "border"
  | "foreground"
  | "muted"
  | "primary"
  | "primaryForeground"
  | "primaryTint"
  | "primaryTintStrong"
  | "focusRing"
  | "indicator"
  | "indicatorForeground"
  | "danger"
  | "success"
  | "info"
  | "warning";

export type ThemeStatusForegroundKey =
  | "dangerForeground"
  | "successForeground"
  | "infoForeground"
  | "warningForeground";

export type ThemeFontWeightKey = FontWeightStep;
export type ThemeFontWeights = Record<ThemeFontWeightKey, number>;

export type ThemeColors = Record<ThemeColorKey, string>;
export type ThemeStatusForegrounds = Record<ThemeStatusForegroundKey, string>;

/** Color preset keys - each has dark and light option. */
export type ColorPresetKey =
  | "dark"
  | "light"
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
  | "dreamland"
  | "harvest"
  | "mystic"
  | "lavender";

export type ThemeTokenState = {
  theme: ThemeMode;
  space: number;
  size: number;
  radius: number;
  borderWidth: number;
  textScale: number;
  fontFamily: string;
  fontFamilyMono: string;
  fontWeights: ThemeFontWeights;
  shadowStrength: number;
  /** Factor blur/offset shadows (`--shadow-size`). */
  shadowSize: number;
  /** Substrate size multiplier Toast (`--toast-scrim-size`). */
  toastScrimSize: number;
  /** Substrate Density Multiplier Toast (`--toast-scrim-density`). */
  toastScrimDensity: number;
  interactiveDuration: number;
  tooltipDuration: number;
  expandDuration: number;
  progressFillDuration: number;
  loadingDotsDuration: number;
  enableHoverLift: boolean;
  enablePressSqueeze: boolean;
  enableToggleButtonFill: boolean;
  enableRipple: boolean;
  enableExpandable: boolean;
  enableToastStack: boolean;
  enableAsyncButtonCrossfade: boolean;
  enableContentFade: boolean;
  enableFeedbackExpand: boolean;
  enableProgressFill: boolean;
  enableLoadingDots: boolean;
  colors: ThemeColors;
  statusForegrounds: ThemeStatusForegrounds;
  /** true — `--color-border` is given inline; false — formula from tokens/styles.css (as in Storybook). */
  borderCustomized: boolean;
  /** Active color preset; `null` — manual color editing. */
  colorPreset: ColorPresetKey | null;
};

export const COLOR_CSS_VAR: Record<ThemeColorKey, string> = {
  background: "--color-background",
  surface: "--color-surface",
  secondary: "--color-secondary",
  secondaryForeground: "--color-secondary-foreground",
  tertiary: "--color-tertiary",
  tertiaryForeground: "--color-tertiary-foreground",
  border: "--color-border",
  foreground: "--color-foreground",
  muted: "--color-muted",
  primary: "--color-primary",
  primaryForeground: "--color-primary-foreground",
  primaryTint: "--color-primary-tint",
  primaryTintStrong: "--color-primary-tint-strong",
  focusRing: "--color-focus-ring",
  indicator: "--color-indicator",
  indicatorForeground: "--color-indicator-foreground",
  danger: "--color-danger",
  success: "--color-success",
  info: "--color-info",
  warning: "--color-warning",
};

export const STATUS_FOREGROUND_CSS_VAR: Record<ThemeStatusForegroundKey, string> = {
  dangerForeground: "--color-danger-foreground",
  successForeground: "--color-success-foreground",
  infoForeground: "--color-info-foreground",
  warningForeground: "--color-warning-foreground",
};

export const FONT_WEIGHT_LABELS: Record<ThemeFontWeightKey, string> = Object.fromEntries(
  (Object.keys(FONT_WEIGHT_CSS_VAR) as ThemeFontWeightKey[]).map((key) => [
    key,
    FONT_WEIGHT_CSS_VAR[key],
  ]),
) as Record<ThemeFontWeightKey, string>;

/** Control labels = names CSS-variables. */
export const COLOR_LABELS: Record<ThemeColorKey, string> = Object.fromEntries(
  (Object.keys(COLOR_CSS_VAR) as ThemeColorKey[]).map((key) => [key, COLOR_CSS_VAR[key]]),
) as Record<ThemeColorKey, string>;

export const STATUS_FOREGROUND_LABELS: Record<ThemeStatusForegroundKey, string> = Object.fromEntries(
  (Object.keys(STATUS_FOREGROUND_CSS_VAR) as ThemeStatusForegroundKey[]).map((key) => [
    key,
    STATUS_FOREGROUND_CSS_VAR[key],
  ]),
) as Record<ThemeStatusForegroundKey, string>;

/** Border formula for UI (dark and light — one line, as in tokens/styles.css). */
export const BORDER_COLOR_CSS_FORMULA_BY_THEME: Record<ThemeMode, string> = {
  dark: BORDER_COLOR_CSS_FORMULA,
  light: BORDER_COLOR_CSS_FORMULA,
};

export function isDefaultBorderColor(border: string): boolean {
  return border === BORDER_COLOR_CSS_FORMULA;
}

export function isBorderColorCustomized(colors: ThemeColors, _theme?: ThemeMode): boolean {
  return !isDefaultBorderColor(colors.border);
}


export const SCALE_DEFAULTS = {
  space: 0.5,
  size: 1,
  /** Base radius in rem; steps `rounded-*` — multipliers from `--radius`. */
  radius: 0.5,
  borderWidth: 1,
  textScale: 1,
  shadowStrength: 1,
  shadowSize: 1,
  toastScrimSize: 1,
  toastScrimDensity: 1,
  interactiveDuration: 280,
  tooltipDuration: 200,
  expandDuration: 200,
  progressFillDuration: 600,
  loadingDotsDuration: 900,
  enableHoverLift: true,
  enablePressSqueeze: true,
  enableToggleButtonFill: true,
  enableRipple: true,
  enableExpandable: true,
  enableToastStack: true,
  enableAsyncButtonCrossfade: true,
  enableContentFade: true,
  enableFeedbackExpand: true,
  enableProgressFill: true,
  enableLoadingDots: true,
} as const;

/** Sets only scale-values ​​for layout presets. Don't touch the colors. */
export const LAYOUT_PRESETS = {
  compact:  { space: 0.4,   size: 0.9,   radius: 0.375, borderWidth: 1, textScale: 0.95 },
  spacious: { space: 0.625, size: 1.125, radius: 0.625, borderWidth: 1, textScale: 1.05 },
  flat:     { space: 0.5,   size: 1,     radius: 0.375, borderWidth: 0, textScale: 1 },
} as const;

export type LayoutPresetKey = keyof typeof LAYOUT_PRESETS;

export const DEFAULT_FONT =
  'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

export const DEFAULT_FONT_MONO = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";

export const FONT_PRESETS = [
  { id: "system", label: "System UI", value: DEFAULT_FONT },
  {
    id: "inter",
    label: "Inter",
    value: 'Inter, ui-sans-serif, system-ui, sans-serif',
  },
  {
    id: "geist",
    label: "Geist",
    value: 'Geist, ui-sans-serif, system-ui, sans-serif',
  },
  {
    id: "plex-sans",
    label: "IBM Plex Sans",
    value: '"IBM Plex Sans", ui-sans-serif, system-ui, sans-serif',
  },
  {
    id: "dm-sans",
    label: "DM Sans",
    value: '"DM Sans", ui-sans-serif, system-ui, sans-serif',
  },
  {
    id: "manrope",
    label: "Manrope",
    value: "Manrope, ui-sans-serif, system-ui, sans-serif",
  },
  {
    id: "source-sans",
    label: "Source Sans 3",
    value: '"Source Sans 3", ui-sans-serif, system-ui, sans-serif',
  },
  {
    id: "outfit",
    label: "Outfit",
    value: "Outfit, ui-sans-serif, system-ui, sans-serif",
  },
  {
    id: "plus-jakarta",
    label: "Plus Jakarta Sans",
    value: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
  },
  {
    id: "roboto",
    label: "Roboto",
    value: "Roboto, ui-sans-serif, system-ui, sans-serif",
  },
  {
    id: "open-sans",
    label: "Open Sans",
    value: '"Open Sans", ui-sans-serif, system-ui, sans-serif',
  },
  {
    id: "figtree",
    label: "Figtree",
    value: "Figtree, ui-sans-serif, system-ui, sans-serif",
  },
  {
    id: "nunito-sans",
    label: "Nunito Sans",
    value: '"Nunito Sans", ui-sans-serif, system-ui, sans-serif',
  },
  {
    id: "work-sans",
    label: "Work Sans",
    value: '"Work Sans", ui-sans-serif, system-ui, sans-serif',
  },
] as const;

export const MONO_FONT_PRESETS = [
  { id: "system", label: "System Mono", value: DEFAULT_FONT_MONO },
  {
    id: "jetbrains",
    label: "JetBrains Mono",
    value: '"JetBrains Mono", ui-monospace, monospace',
  },
  {
    id: "fira",
    label: "Fira Code",
    value: '"Fira Code", ui-monospace, monospace',
  },
  {
    id: "source-code-pro",
    label: "Source Code Pro",
    value: '"Source Code Pro", ui-monospace, monospace',
  },
  {
    id: "roboto-mono",
    label: "Roboto Mono",
    value: '"Roboto Mono", ui-monospace, monospace',
  },
  {
    id: "plex-mono",
    label: "IBM Plex Mono",
    value: '"IBM Plex Mono", ui-monospace, monospace',
  },
  {
    id: "space-mono",
    label: "Space Mono",
    value: '"Space Mono", ui-monospace, monospace',
  },
] as const;

/** Basic typography sizes from `src/tokens/styles.css` (rem). */
export const TEXT_SCALE_BASES = {
  tools: { size: 0.6875, line: 0.875 },
  xsmall: { size: 0.75, line: 1 },
  small: { size: 0.875, line: 1.25 },
  base: { size: 1, line: 1.5 },
  mid: { size: 1.125, line: 1.75 },
  large: { size: 1.25, line: 1.75 },
  xlarge: { size: 1.5, line: 2 },
  "2xlarge": { size: 1.875, line: 2.25 },
  "3xlarge": { size: 2.25, line: 2.5 },
} as const;

type TextScaleToken = keyof typeof TEXT_SCALE_BASES;

const SHADOW_BASE = {
  dark: {
    base: 0.15,
    mid: 0.2,
    large: 0.24,
  },
  light: {
    base: 0.08,
    mid: 0.12,
    large: 0.16,
  },
} as const;

/** One layer, offset-x: 0, negative spread — shadow only from below. [offsetX, offsetY, blur, spread] */
const SHADOW_LAYER_GEOM = {
  base: [[0, 2, 4, -2]],
  mid: [[0, 4, 10, -6]],
  large: [[0, 8, 20, -12]],
} as const;

type ShadowLevelKey = keyof typeof SHADOW_LAYER_GEOM;

function shadowLayerPx(
  offsetX: number,
  offsetY: number,
  blur: number,
  spread: number,
  opacity: number,
  size: number,
): string {
  const dim = (value: number) => {
    if (value === 0) return "0";
    return `${value * size}px`;
  };
  return `${dim(offsetX)} ${dim(offsetY)} ${dim(blur)} ${dim(spread)} rgb(0 0 0 / ${opacity})`;
}

function buildShadowLevel(
  level: ShadowLevelKey,
  theme: ThemeMode,
  strength: number,
  size: number,
): string {
  const opacity = SHADOW_BASE[theme][level] * strength;
  const [offsetX, offsetY, blur, spread] = SHADOW_LAYER_GEOM[level][0];
  return shadowLayerPx(offsetX, offsetY, blur, spread, opacity, size);
}

function applyShadows(
  root: HTMLElement,
  theme: ThemeMode,
  strength: number,
  size: number,
) {
  root.style.setProperty("--shadow-size", String(size));
  root.style.setProperty("--shadow-none", buildShadowLevel("base", theme, 0, size));
  root.style.setProperty("--shadow-base", buildShadowLevel("base", theme, strength, size));
  root.style.setProperty("--shadow-mid", buildShadowLevel("mid", theme, strength, size));
  root.style.setProperty("--shadow-large", buildShadowLevel("large", theme, strength, size));
}

function applyTextScale(root: HTMLElement, textScale: number) {
  for (const key of Object.keys(TEXT_SCALE_BASES) as TextScaleToken[]) {
    const { size, line } = TEXT_SCALE_BASES[key];
    const scaledSize = size * textScale;
    const scaledLine = line * textScale;
    root.style.setProperty(`--text-scale-${key}`, `${scaledSize}rem`);
    root.style.setProperty(
      `--text-scale-${key}--line-height`,
      `calc(${scaledLine}rem / ${scaledSize}rem)`,
    );
  }
}

function applyFontWeights(root: HTMLElement, fontWeights: ThemeFontWeights) {
  for (const [key, cssVar] of Object.entries(FONT_WEIGHT_CSS_VAR) as [ThemeFontWeightKey, string][]) {
    root.style.setProperty(cssVar, String(fontWeights[key]));
  }
}

export function createDefaultThemeState(theme: ThemeMode = "dark"): ThemeTokenState {
  return {
    theme,
    ...SCALE_DEFAULTS,
    fontFamily: DEFAULT_FONT,
    fontFamilyMono: DEFAULT_FONT_MONO,
    fontWeights: { ...FONT_WEIGHT_DEFAULTS },
    colors: theme === "light" ? { ...LIGHT_COLORS } : { ...DARK_COLORS },
    statusForegrounds:
      theme === "light" ? { ...LIGHT_STATUS_FOREGROUNDS } : { ...DARK_STATUS_FOREGROUNDS },
    borderCustomized: false,
    colorPreset: theme === "light" ? "light" : "dark",
  };
}


const INLINE_TOKEN_VARS = [
  "--space",
  "--size",
  "--radius",
  "--border-width",
  "--font-family-sans",
  "--font-family-mono",
  ...Object.values(FONT_WEIGHT_CSS_VAR),
  "--shadow-size",
  "--shadow-none",
  "--shadow-base",
  "--shadow-mid",
  "--shadow-large",
  "--toast-scrim-size",
  "--toast-scrim-density",
  ...Object.keys(TEXT_SCALE_BASES).flatMap((key) => [
    `--text-scale-${key}`,
    `--text-scale-${key}--line-height`,
  ]),
  ...Object.values(COLOR_CSS_VAR),
  ...Object.values(STATUS_FOREGROUND_CSS_VAR),
] as const;

export function clearThemeInlineTokens(root: HTMLElement = document.documentElement) {
  for (const name of INLINE_TOKEN_VARS) {
    root.style.removeProperty(name);
  }
  delete root.dataset.theme;
}

export async function applyThemeTokens(state: ThemeTokenState, root: HTMLElement = document.documentElement) {
  if (state.theme === "light") {
    root.dataset.theme = "light";
  } else {
    delete root.dataset.theme;
  }

  root.style.setProperty("--space", `${state.space}rem`);
  root.style.setProperty("--size", `${state.size}rem`);
  root.style.setProperty("--radius", `${state.radius}rem`);
  root.style.setProperty("--border-width", state.borderWidth === 0 ? "0px" : `${state.borderWidth}px`);
  root.style.setProperty("--font-family-sans", state.fontFamily);
  root.style.setProperty("--font-family-mono", state.fontFamilyMono);
  applyFontWeights(root, state.fontWeights);

  // Apply global animation flags to our MotionConfig
  const { configureMotion } = await import("@/components/core/utils/motionConfig");
  configureMotion({
    interactiveDuration: state.interactiveDuration,
    tooltipDuration: state.tooltipDuration,
    expandDuration: state.expandDuration,
    enableHoverLift: state.enableHoverLift,
    enablePressSqueeze: state.enablePressSqueeze,
    enableToggleButtonFill: state.enableToggleButtonFill,
    enableRipple: state.enableRipple,
    enableExpandable: state.enableExpandable,
    enableToastStack: state.enableToastStack,
    enableAsyncButtonCrossfade: state.enableAsyncButtonCrossfade,
    enableContentFade: state.enableContentFade,
    enableFeedbackExpand: state.enableFeedbackExpand,
    progressFillDuration: state.progressFillDuration,
    enableProgressFill: state.enableProgressFill,
    loadingDotsDuration: state.loadingDotsDuration,
    enableLoadingDots: state.enableLoadingDots,
  });

  applyTextScale(root, state.textScale);
  applyShadows(root, state.theme, state.shadowStrength, state.shadowSize);
  root.style.setProperty("--toast-scrim-size", String(state.toastScrimSize));
  root.style.setProperty("--toast-scrim-density", String(state.toastScrimDensity));

  if (state.borderCustomized) {
    root.style.setProperty("--color-border", state.colors.border);
  } else {
    root.style.removeProperty("--color-border");
  }

  for (const [key, cssVar] of Object.entries(COLOR_CSS_VAR) as [ThemeColorKey, string][]) {
    if (key === "border") continue;
    root.style.setProperty(cssVar, state.colors[key]);
  }

  for (const [key, cssVar] of Object.entries(STATUS_FOREGROUND_CSS_VAR) as [
    ThemeStatusForegroundKey,
    string,
  ][]) {
    root.style.setProperty(cssVar, state.statusForegrounds[key]);
  }
}

export function exportThemeCss(state: ThemeTokenState): string {
  const lines = [
    ":root {",
    `  --space: ${state.space}rem;`,
    `  --size: ${state.size}rem;`,
    `  --radius: ${state.radius}rem;`,
    `  --border-width: ${state.borderWidth === 0 ? "0px" : `${state.borderWidth}px`};`,
    `  --font-family-sans: ${state.fontFamily};`,
    `  --font-family-mono: ${state.fontFamilyMono};`,
    ...Object.entries(FONT_WEIGHT_CSS_VAR).map(
      ([key, cssVar]) => `  ${cssVar}: ${state.fontWeights[key as ThemeFontWeightKey]};`,
    ),
    `  --shadow-size: ${state.shadowSize};`,
    `  --toast-scrim-size: ${state.toastScrimSize};`,
    `  --toast-scrim-density: ${state.toastScrimDensity};`,
    `  /* textScale: ${state.textScale} — set --text-scale-* manually or via applyThemeTokens */`,
    `  /* shadowStrength: ${state.shadowStrength}, shadowSize: ${state.shadowSize} */`,
    `  /* toastScrimSize: ${state.toastScrimSize}, toastScrimDensity: ${state.toastScrimDensity} */`,
  ];

  for (const [key, cssVar] of Object.entries(COLOR_CSS_VAR) as [ThemeColorKey, string][]) {
    if (key === "border" && !state.borderCustomized) {
      lines.push(
        `  /* ${cssVar}: ${BORDER_COLOR_CSS_FORMULA} — from tokens/styles.css */`,
      );
      continue;
    }
    lines.push(`  ${cssVar}: ${state.colors[key]};`);
  }

  for (const [key, cssVar] of Object.entries(STATUS_FOREGROUND_CSS_VAR) as [
    ThemeStatusForegroundKey,
    string,
  ][]) {
    lines.push(`  ${cssVar}: ${state.statusForegrounds[key]};`);
  }

  lines.push("}");

  if (state.theme === "light") {
    lines.push("", '/* Optional: light theme via data-attribute */');
    lines.push('/* <html data-theme="light"> */');
  }

  return lines.join("\n");
}
