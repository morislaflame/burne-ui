export type ThemeMode = "dark" | "light";

import {
  BORDER_COLOR_CSS_FORMULA,
  DARK_COLORS,
  LIGHT_COLORS,
  DARK_STATUS_FOREGROUNDS,
  LIGHT_STATUS_FOREGROUNDS,
} from "./themePalettes";

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

export type ThemeColors = Record<ThemeColorKey, string>;
export type ThemeStatusForegrounds = Record<ThemeStatusForegroundKey, string>;

/** Ключи цветовых пресетов — каждый имеет dark и light вариант. */
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
  | "autumn";

export type ThemeTokenState = {
  theme: ThemeMode;
  space: number;
  size: number;
  radius: number;
  borderWidth: number;
  textScale: number;
  fontFamily: string;
  fontFamilyMono: string;
  shadowStrength: number;
  /** Множитель blur/offset теней (`--shadow-size`). */
  shadowSize: number;
  /** Множитель размера подложки Toast (`--toast-scrim-size`). */
  toastScrimSize: number;
  /** Множитель плотности подложки Toast (`--toast-scrim-density`). */
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
  /** true — `--color-border` задаётся inline; false — формула из tokens/styles.css (как в Storybook). */
  borderCustomized: boolean;
  /** Активный цветовой пресет; `null` — ручная правка цветов. */
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

/** Лейблы контролов = имена CSS-переменных. */
export const COLOR_LABELS: Record<ThemeColorKey, string> = Object.fromEntries(
  (Object.keys(COLOR_CSS_VAR) as ThemeColorKey[]).map((key) => [key, COLOR_CSS_VAR[key]]),
) as Record<ThemeColorKey, string>;

export const STATUS_FOREGROUND_LABELS: Record<ThemeStatusForegroundKey, string> = Object.fromEntries(
  (Object.keys(STATUS_FOREGROUND_CSS_VAR) as ThemeStatusForegroundKey[]).map((key) => [
    key,
    STATUS_FOREGROUND_CSS_VAR[key],
  ]),
) as Record<ThemeStatusForegroundKey, string>;

/** Формула border для UI (dark и light — одна строка, как в tokens/styles.css). */
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
  /** Базовый радиус в rem; ступени `rounded-*` — множители от `--radius`. */
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

/** Наборы только scale-значений для лейаут-пресетов. Не трогают цвета. */
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
] as const;

/** Базовые размеры типографики из `src/tokens/styles.css` (rem). */
export const TEXT_SCALE_BASES = {
  tools: { size: 0.6875, line: 0.875 },
  xs: { size: 0.75, line: 1 },
  sm: { size: 0.875, line: 1.25 },
  md: { size: 1, line: 1.5 },
  lg: { size: 1.125, line: 1.75 },
  xl: { size: 1.25, line: 1.75 },
  "2xl": { size: 1.5, line: 2 },
  "3xl": { size: 1.875, line: 2.25 },
  "4xl": { size: 2.25, line: 2.5 },
} as const;

type TextScaleToken = keyof typeof TEXT_SCALE_BASES;

const SHADOW_BASE = {
  dark: {
    sm: 0.15,
    md: 0.2,
    lg: 0.24,
  },
  light: {
    sm: 0.08,
    md: 0.12,
    lg: 0.16,
  },
} as const;

/** Один слой, offset-x: 0, отрицательный spread — тень только снизу. [offsetX, offsetY, blur, spread] */
const SHADOW_LAYER_GEOM = {
  sm: [[0, 2, 4, -2]],
  md: [[0, 4, 10, -6]],
  lg: [[0, 8, 20, -12]],
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
  root.style.setProperty("--shadow-none", buildShadowLevel("sm", theme, 0, size));
  root.style.setProperty("--shadow-sm", buildShadowLevel("sm", theme, strength, size));
  root.style.setProperty("--shadow-md", buildShadowLevel("md", theme, strength, size));
  root.style.setProperty("--shadow-lg", buildShadowLevel("lg", theme, strength, size));
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

export function createDefaultThemeState(theme: ThemeMode = "dark"): ThemeTokenState {
  return {
    theme,
    ...SCALE_DEFAULTS,
    fontFamily: DEFAULT_FONT,
    fontFamilyMono: DEFAULT_FONT_MONO,
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
  "--shadow-size",
  "--shadow-none",
  "--shadow-sm",
  "--shadow-md",
  "--shadow-lg",
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

  // Применяем глобальные флаги анимации в наш MotionConfig
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
    `  --shadow-size: ${state.shadowSize};`,
    `  --toast-scrim-size: ${state.toastScrimSize};`,
    `  --toast-scrim-density: ${state.toastScrimDensity};`,
    `  /* textScale: ${state.textScale} — задайте --text-scale-* вручную или через applyThemeTokens */`,
    `  /* shadowStrength: ${state.shadowStrength}, shadowSize: ${state.shadowSize} */`,
    `  /* toastScrimSize: ${state.toastScrimSize}, toastScrimDensity: ${state.toastScrimDensity} */`,
  ];

  for (const [key, cssVar] of Object.entries(COLOR_CSS_VAR) as [ThemeColorKey, string][]) {
    if (key === "border" && !state.borderCustomized) {
      lines.push(
        `  /* ${cssVar}: ${BORDER_COLOR_CSS_FORMULA} — из tokens/styles.css */`,
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
    lines.push("", '/* Опционально: светлая тема через data-атрибут */');
    lines.push('/* <html data-theme="light"> */');
  }

  return lines.join("\n");
}
