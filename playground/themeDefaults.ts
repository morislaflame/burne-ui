export type ThemeMode = "dark" | "light";

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
  interactiveDuration: number;
  tooltipDuration: number;
  expandDuration: number;
  glassBlur: number;
  glassSaturate: number;
  enableHoverLift: boolean;
  enablePressSqueeze: boolean;
  enableToggleButtonFill: boolean;
  enableRipple: boolean;
  enableExpandable: boolean;
  enableToastStack: boolean;
  enableAsyncButtonCrossfade: boolean;
  enableContentFade: boolean;
  enableFeedbackExpand: boolean;
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

/** Как в tokens/styles.css — следует при смене primary через var(). */
const PRIMARY_TINT = "color-mix(in oklab, var(--color-primary) 10%, transparent)";
const PRIMARY_TINT_STRONG = "color-mix(in oklab, var(--color-primary) 20%, transparent)";

/** Bold — mix с surface на тёмном фоне. */
const BOLD_PRIMARY_TINT = "color-mix(in oklab, var(--color-primary) 16%, var(--color-surface))";
const BOLD_PRIMARY_TINT_STRONG = "color-mix(in oklab, #4361ee 24%, var(--color-surface))";

/** Autumn — тёплый strong-tint из Sunflower Gold. */
const AUTUMN_PRIMARY_TINT = "color-mix(in oklab, var(--color-primary) 14%, var(--color-surface))";
const AUTUMN_PRIMARY_TINT_STRONG = "color-mix(in oklab, #fcbf49 22%, var(--color-surface))";

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

const DARK_COLORS: ThemeColors = {
  background: "#0c0d10",
  surface: "#15171c",
  secondary: "#25282d",
  secondaryForeground: "#f4f5f7",
  tertiary: "#2e3239",
  tertiaryForeground: "#f4f5f7",
  border: "#2a2d36",
  foreground: "#f4f5f7",
  muted: "#8b90a0",
  primary: "#ebebef",
  primaryForeground: "#0c0c0e",
  focusRing: "#ebebef",
  indicator: "#ebebef",
  indicatorForeground: "#0c0c0e",
  danger: "#dc2626",
  success: "#22c55e",
  info: "#0ea5e9",
  warning: "#f59e0b",
  primaryTint: PRIMARY_TINT,
  primaryTintStrong: PRIMARY_TINT_STRONG,
};

const LIGHT_COLORS: ThemeColors = {
  background: "#f5f5f5",
  surface: "#ffffff",
  secondary: "#ebebec",
  secondaryForeground: "#18181b",
  tertiary: "#e2e2e4",
  tertiaryForeground: "#18181b",
  border: "#e4e4e7",
  foreground: "#18181b",
  muted: "#71717a",
  primary: "#18181b",
  primaryForeground: "#fafafa",
  focusRing: "#18181b",
  indicator: "#18181b",
  indicatorForeground: "#fafafa",
  danger: "#dc2626",
  success: "#22c55e",
  info: "#0ea5e9",
  warning: "#f59e0b",
  primaryTint: PRIMARY_TINT,
  primaryTintStrong: PRIMARY_TINT_STRONG,
};

/** Hex в `colors.border` для UI; по умолчанию не пишется inline — только при `borderCustomized`. */
export const DEFAULT_BORDER_HEX: Record<ThemeMode, string> = {
  dark: DARK_COLORS.border,
  light: LIGHT_COLORS.border,
};

/** Как в `src/tokens/styles.css` — когда `borderCustomized === false`. */
export const BORDER_COLOR_CSS_FORMULA: Record<ThemeMode, string> = {
  dark: "color-mix(in oklab, var(--color-foreground) 12%, transparent)",
  light: "color-mix(in oklab, var(--color-foreground) 12%, var(--color-surface))",
};

export function isBorderColorCustomized(colors: ThemeColors, theme: ThemeMode): boolean {
  return colors.border !== DEFAULT_BORDER_HEX[theme];
}

const DARK_STATUS_FOREGROUNDS: ThemeStatusForegrounds = {
  dangerForeground: "#fafafa",
  successForeground: "#fafafa",
  infoForeground: "#fafafa",
  warningForeground: "#0c0c0e",
};

const LIGHT_STATUS_FOREGROUNDS: ThemeStatusForegrounds = {
  dangerForeground: "#ffffff",
  successForeground: "#ffffff",
  infoForeground: "#ffffff",
  warningForeground: "#0c0c0e",
};

export const SCALE_DEFAULTS = {
  space: 0.5,
  size: 1,
  /** Базовый радиус в rem; ступени `rounded-*` — множители от `--radius`. */
  radius: 0.5,
  borderWidth: 1,
  textScale: 1,
  shadowStrength: 1,
  shadowSize: 1,
  interactiveDuration: 280,
  tooltipDuration: 200,
  expandDuration: 200,
  glassBlur: 22,
  glassSaturate: 1.45,
  enableHoverLift: true,
  enablePressSqueeze: true,
  enableToggleButtonFill: true,
  enableRipple: true,
  enableExpandable: true,
  enableToastStack: true,
  enableAsyncButtonCrossfade: true,
  enableContentFade: true,
  enableFeedbackExpand: true,
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
    sm: [0.18, 0.12] as const,
    md: [0.24, 0.14] as const,
    lg: [0.3, 0.18] as const,
  },
  light: {
    sm: [0.1, 0.07] as const,
    md: [0.13, 0.08] as const,
    lg: [0.18, 0.1] as const,
  },
} as const;

const SHADOW_LAYER_GEOM = {
  sm: [
    [0, 1, 3, 0],
    [0, 1, 2, -1],
  ],
  md: [
    [0, 3, 8, -1],
    [0, 2, 4, -2],
  ],
  lg: [
    [0, 8, 20, -4],
    [0, 4, 8, -4],
  ],
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
  const dim = (value: number) => (value === 0 ? "0" : `${value * size}px`);
  return `${dim(offsetX)} ${dim(offsetY)} ${dim(blur)} ${dim(spread)} rgb(0 0 0 / ${opacity})`;
}

function buildShadowLevel(
  level: ShadowLevelKey,
  theme: ThemeMode,
  strength: number,
  size: number,
): string {
  const opacities = SHADOW_BASE[theme][level];
  return SHADOW_LAYER_GEOM[level]
    .map((geom, index) =>
      shadowLayerPx(geom[0], geom[1], geom[2], geom[3], opacities[index] * strength, size),
    )
    .join(", ");
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

// ─── Цветовые наборы для пресетов ──────────────────────────────────────────

const OCEAN_DARK_COLORS: ThemeColors = {
  background: "#0c0d10",
  surface: "#16191d",
  secondary: "#202a37",
  secondaryForeground: "#f4f5f7",
  tertiary: "#283442",
  tertiaryForeground: "#f4f5f7",
  border: "#2a2d36",
  foreground: "#f4f5f7",
  muted: "#8b90a0",
  primary: "#38bdf8",
  primaryForeground: "#000000",
  focusRing: "#38bdf8",
  indicator: "#06b6d4",
  indicatorForeground: "#000000",
  danger: "#dc2626",
  success: "#22c55e",
  info: "#0ea5e9",
  warning: "#f59e0b",
  primaryTint: PRIMARY_TINT,
  primaryTintStrong: PRIMARY_TINT_STRONG,
};

const VIOLET_DARK_COLORS: ThemeColors = {
  background: "#0c0d10",
  surface: "#17161d",
  secondary: "#28243a",
  secondaryForeground: "#f4f5f7",
  tertiary: "#312d45",
  tertiaryForeground: "#f4f5f7",
  border: "#2a2d36",
  foreground: "#f4f5f7",
  muted: "#8b90a0",
  primary: "#5a189a",
  primaryForeground: "#f4f5f7",
  focusRing: "#5a189a",
  indicator: "#8b5cf6",
  indicatorForeground: "#f4f5f7",
  danger: "#dc2626",
  success: "#22c55e",
  info: "#0ea5e9",
  warning: "#f59e0b",
  primaryTint: PRIMARY_TINT,
  primaryTintStrong: PRIMARY_TINT_STRONG,
};

const EMERALD_DARK_COLORS: ThemeColors = {
  background: "#0c0d10",
  surface: "#121716",
  secondary: "#1f332e",
  secondaryForeground: "#f4f5f7",
  tertiary: "#273d38",
  tertiaryForeground: "#f4f5f7",
  border: "#2a2d36",
  foreground: "#f4f5f7",
  muted: "#8b90a0",
  primary: "#34d399",
  primaryForeground: "#f4f5f7",
  focusRing: "#34d399",
  indicator: "#10b981",
  indicatorForeground: "#f4f5f7",
  danger: "#dc2626",
  success: "#22c55e",
  info: "#0ea5e9",
  warning: "#f59e0b",
  primaryTint: PRIMARY_TINT,
  primaryTintStrong: PRIMARY_TINT_STRONG,
};

const ROSE_LIGHT_COLORS: ThemeColors = {
  background: "#fafafa",
  surface: "#ffffff",
  secondary: "#ebebec",
  secondaryForeground: "#18181b",
  tertiary: "#e2e2e4",
  tertiaryForeground: "#18181b",
  border: "#fecdd3",
  foreground: "#18181b",
  muted: "#71717a",
  primary: "#f43f5e",
  primaryForeground: "#ffffff",
  focusRing: "#f43f5e",
  indicator: "#e11d48",
  indicatorForeground: "#ffffff",
  danger: "#dc2626",
  success: "#22c55e",
  info: "#0ea5e9",
  warning: "#f59e0b",
  primaryTint: PRIMARY_TINT,
  primaryTintStrong: PRIMARY_TINT_STRONG,
};

const AMBER_LIGHT_COLORS: ThemeColors = {
  background: "#fafafa",
  surface: "#ffffff",
  secondary: "#ebebec",
  secondaryForeground: "#18181b",
  tertiary: "#e2e2e4",
  tertiaryForeground: "#18181b",
  border: "#fde68a",
  foreground: "#18181b",
  muted: "#71717a",
  primary: "#d97706",
  primaryForeground: "#ffffff",
  focusRing: "#d97706",
  indicator: "#b45309",
  indicatorForeground: "#ffffff",
  danger: "#dc2626",
  success: "#22c55e",
  info: "#0ea5e9",
  warning: "#f59e0b",
  primaryTint: PRIMARY_TINT,
  primaryTintStrong: PRIMARY_TINT_STRONG,
};

const SLATE_LIGHT_COLORS: ThemeColors = {
  background: "#fafafa",
  surface: "#ffffff",
  secondary: "#ebebec",
  secondaryForeground: "#18181b",
  tertiary: "#e2e2e4",
  tertiaryForeground: "#18181b",
  border: "#e2e8f0",
  foreground: "#18181b",
  muted: "#71717a",
  primary: "#6366f1",
  primaryForeground: "#ffffff",
  focusRing: "#6366f1",
  indicator: "#6366f1",
  indicatorForeground: "#ffffff",
  danger: "#dc2626",
  success: "#22c55e",
  info: "#0ea5e9",
  warning: "#f59e0b",
  primaryTint: PRIMARY_TINT,
  primaryTintStrong: PRIMARY_TINT_STRONG,
};

// ─── Новые палитры ──────────────────────────────────────────────────────────

/**
 * Toffee — тёплая кремово-коричневая светлая тема.
 * Palette: Almond Cream → Desert Sand → Tan → Faded Copper → Coffee Bean → Toffee Brown
 */
const TOFFEE_LIGHT_COLORS: ThemeColors = {
  background: "#ede0d4",
  surface: "#f8f3ee",
  secondary: "#e8e1dc",
  secondaryForeground: "#2d1208",
  tertiary: "#e0d9d4",
  tertiaryForeground: "#2d1208",
  border: "#b08968",
  foreground: "#2d1208",
  muted: "#9c6644",
  primary: "#7f5539",
  primaryForeground: "#f8f3ee",
  focusRing: "#7f5539",
  indicator: "#9c6644",
  indicatorForeground: "#f8f3ee",
  danger: "#dc2626",
  success: "#22c55e",
  info: "#0ea5e9",
  warning: "#d97706",
  primaryTint: PRIMARY_TINT,
  primaryTintStrong: PRIMARY_TINT_STRONG,
};

/**
 * Berry — светлая тема в тонах спелой ягоды.
 * Самые светлые цвета палитры — в роли фонов, Rich Mahogany — текст, Berry Crush — акцент.
 * Palette: Almond Silk → Rosy Taupe → Berry Crush → Burgundy → Rich Mahogany
 */
const BERRY_LIGHT_COLORS: ThemeColors = {
  background: "#f1e4df",
  surface: "#f5ece6",
  secondary: "#e5dad4",
  secondaryForeground: "#2c0703",
  tertiary: "#ddd2cc",
  tertiaryForeground: "#2c0703",
  border: "#da9f93",
  foreground: "#2c0703",
  muted: "#7a3040",
  primary: "#b6465f",
  primaryForeground: "#ffffff",
  focusRing: "#b6465f",
  indicator: "#890620",
  indicatorForeground: "#ffffff",
  danger: "#dc2626",
  success: "#22c55e",
  info: "#0ea5e9",
  warning: "#d97706",
  primaryTint: PRIMARY_TINT,
  primaryTintStrong: PRIMARY_TINT_STRONG,
};

/**
 * Paprika — пряная светлая тема: тёплые нейтральные + яркий оранжево-красный акцент.
 * Palette: Dust Grey ≈ Bone → Powder Blush → Spicy Paprika → Burnt Tangerine
 */
const PAPRIKA_LIGHT_COLORS: ThemeColors = {
  background: "#d6cbc1",
  surface: "#ede8e2",
  secondary: "#ddd6d0",
  secondaryForeground: "#200d06",
  tertiary: "#d5cec8",
  tertiaryForeground: "#200d06",
  border: "#dcb5a7",
  foreground: "#200d06",
  muted: "#9a6a5e",
  primary: "#e16036",
  primaryForeground: "#ffffff",
  focusRing: "#e16036",
  indicator: "#e3170a",
  indicatorForeground: "#ffffff",
  danger: "#dc2626",
  success: "#22c55e",
  info: "#0ea5e9",
  warning: "#d97706",
  primaryTint: PRIMARY_TINT,
  primaryTintStrong: PRIMARY_TINT_STRONG,
};

/**
 * Cherry — светлая тема в тонах чёрной вишни.
 * Производные светлые фоны из палитры, тёмные красные тона — текст и акцент.
 * Palette: Brown Red → Dark Wine → Black Cherry → Rich Mahogany (#38040e / #250902)
 */
const CHERRY_LIGHT_COLORS: ThemeColors = {
  background: "#f5e8e8",
  surface: "#fff0ee",
  secondary: "#eededd",
  secondaryForeground: "#250902",
  tertiary: "#e6d6d5",
  tertiaryForeground: "#250902",
  border: "#e8bfb8",
  foreground: "#250902",
  muted: "#8a4540",
  primary: "#ad2831",
  primaryForeground: "#ffffff",
  focusRing: "#ad2831",
  indicator: "#800e13",
  indicatorForeground: "#ffffff",
  danger: "#dc2626",
  success: "#22c55e",
  info: "#0ea5e9",
  warning: "#d97706",
  primaryTint: PRIMARY_TINT,
  primaryTintStrong: PRIMARY_TINT_STRONG,
};

/**
 * Rustic Charm — wheat beige, charcoal, rust.
 * Palette: Floral White → Silver → Charcoal Brown → Carbon Black → Spicy Paprika
 */
const RUSTIC_LIGHT_COLORS: ThemeColors = {
  background: "#f6f3ef",
  surface: "#fffcf2",
  secondary: "#f5f0e8",
  secondaryForeground: "#252422",
  tertiary: "#ede8df",
  tertiaryForeground: "#252422",
  border: "#8a837a",
  foreground: "#252422",
  muted: "#403d39",
  primary: "#eb5e28",
  primaryForeground: "#fffcf2",
  focusRing: "#eb5e28",
  indicator: "#c94a1e",
  indicatorForeground: "#fffcf2",
  danger: "#dc2626",
  success: "#22c55e",
  info: "#0ea5e9",
  warning: "#d97706",
  primaryTint: PRIMARY_TINT,
  primaryTintStrong: PRIMARY_TINT_STRONG,
};

/**
 * Earthy Tones — harvest wheat, olive, cocoa.
 * Palette: Vanilla Cream → Cream → Muted Olive → Faded Copper → Ash Brown
 */
const EARTHY_LIGHT_COLORS: ThemeColors = {
  background: "#faf9f5",
  surface: "#f8f4e8",
  secondary: "#ece6d4",
  secondaryForeground: "#3d3228",
  tertiary: "#e4ddd0",
  tertiaryForeground: "#3d3228",
  border: "#a98467",
  foreground: "#3d3228",
  muted: "#6c584c",
  primary: "#adc178",
  primaryForeground: "#0d0d0d",
  focusRing: "#adc178",
  indicator: "#6c584c",
  indicatorForeground: "#adc178",
  danger: "#dc2626",
  success: "#adc178",      // Muted Olive
  info: "#0ea5e9",
  warning: "#d97706",
  primaryTint: PRIMARY_TINT,
  primaryTintStrong: PRIMARY_TINT_STRONG,
};

/**
 * Peach Sorbet — blush pinks and pastel peach.
 * Palette: Light Coral → Sweet Salmon → Powder Blush → Peach Fuzz → Soft Apricot
 */
const PEACH_LIGHT_COLORS: ThemeColors = {
  background: "#ffffff",
  surface: "#fff5ee",
  secondary: "#fce8dc",
  secondaryForeground: "#5c2d2d",
  tertiary: "#f8e0d4",
  tertiaryForeground: "#5c2d2d",
  border: "#f8ad9d",
  foreground: "#5c2d2d",
  muted: "#c97a7a",
  primary: "#f08080",
  primaryForeground: "#ffffff",
  focusRing: "#f08080",
  indicator: "#e06b6b",
  indicatorForeground: "#ffffff",
  danger: "#dc2626",
  success: "#22c55e",
  info: "#0ea5e9",
  warning: "#f59e0b",
  primaryTint: PRIMARY_TINT,
  primaryTintStrong: PRIMARY_TINT_STRONG,
};

/**
 * Soft Sand — creamy tans, blush, gentle browns.
 * Palette: Parchment → Bone → Linen → Almond Cream → Almond Silk
 */
const SAND_LIGHT_COLORS: ThemeColors = {
  background: "#edede9",
  surface: "#f5ebe0",
  secondary: "#ebe3d8",
  secondaryForeground: "#3a342f",
  tertiary: "#e3d9ce",
  tertiaryForeground: "#3a342f",
  border: "#d5bdaf",
  foreground: "#3a342f",
  muted: "#8a7f76",
  primary: "#9a846f",
  primaryForeground: "#f5ebe0",
  focusRing: "#9a846f",
  indicator: "#7a6a58",
  indicatorForeground: "#f5ebe0",
  danger: "#dc2626",
  success: "#22c55e",
  info: "#0ea5e9",
  warning: "#d97706",
  primaryTint: PRIMARY_TINT,
  primaryTintStrong: PRIMARY_TINT_STRONG,
};

/**
 * Bold Hues — electric magenta, purple, crisp blues.
 * Palette: Neon Pink → Indigo Bloom → Vivid Royal → Electric Sapphire → Sky Aqua
 */
const BOLD_DARK_COLORS: ThemeColors = {
  background: "#0c0a14",
  surface: "#14122a",
  secondary: "#1c1a38",
  secondaryForeground: "#f0f4ff",
  tertiary: "#242042",
  tertiaryForeground: "#f0f4ff",
  border: "#2c1b55",
  foreground: "#f0f4ff",
  muted: "#8899cc",
  primary: "#f72585",
  primaryForeground: "#ffffff",
  focusRing: "#f72585",
  indicator: "#f72585",
  indicatorForeground: "#ffffff",
  danger: "#f72585",
  success: "#4cc9f0",      // Sky Aqua
  info: "#4361ee",
  warning: "#f77f00",
  primaryTint: BOLD_PRIMARY_TINT,
  primaryTintStrong: BOLD_PRIMARY_TINT_STRONG,
};

/**
 * Warm Autumn Glow — crimson, amber, gold on deep blue.
 * Palette: Deep Space Blue → Flag Red → Princeton Orange → Sunflower Gold → Vanilla Custard
 */
const AUTUMN_DARK_COLORS: ThemeColors = {
  background: "#01141e",
  surface: "#0a2840",
  secondary: "#123350",
  secondaryForeground: "#f9f6e7",
  tertiary: "#1a3d5c",
  tertiaryForeground: "#f9f6e7",
  border: "#1a4a6e",
  foreground: "#f9f6e7",
  muted: "#a8c4d4",
  primary: "#d62828",
  primaryForeground: "#f4f8fb",
  focusRing: "#d62828",
  indicator: "#d62828",
  indicatorForeground: "#f4f8fb",
  danger: "#d62828",       // Flag Red
  success: "#22c55e",
  info: "#4cc9f0",
  warning: "#fcbf49",
  primaryTint: AUTUMN_PRIMARY_TINT,
  primaryTintStrong: AUTUMN_PRIMARY_TINT_STRONG,
};

const CONTRAST_DARK_COLORS: ThemeColors = {
  ...DARK_COLORS,
  foreground: "#ffffff",
  secondary: "#282a2e",
  secondaryForeground: "#ffffff",
  tertiary: "#313438",
  tertiaryForeground: "#ffffff",
  muted: "#a8adb8",
  primary: "#ffffff",
  primaryForeground: "#0c0c0e",
  focusRing: "#ffffff",
  indicator: "#ffffff",
  indicatorForeground: "#0c0c0e",
  border: "#3d4250",
};

/** Палитры для `colorPresets.ts` (пары dark/light). */
export const paletteColors = {
  PRIMARY_TINT,
  PRIMARY_TINT_STRONG,
  BOLD_PRIMARY_TINT,
  BOLD_PRIMARY_TINT_STRONG,
  AUTUMN_PRIMARY_TINT,
  AUTUMN_PRIMARY_TINT_STRONG,
  DARK_COLORS,
  LIGHT_COLORS,
  DARK_STATUS_FOREGROUNDS,
  LIGHT_STATUS_FOREGROUNDS,
  CONTRAST_DARK_COLORS,
  OCEAN_DARK_COLORS,
  VIOLET_DARK_COLORS,
  EMERALD_DARK_COLORS,
  ROSE_LIGHT_COLORS,
  AMBER_LIGHT_COLORS,
  SLATE_LIGHT_COLORS,
  TOFFEE_LIGHT_COLORS,
  BERRY_LIGHT_COLORS,
  PAPRIKA_LIGHT_COLORS,
  CHERRY_LIGHT_COLORS,
  RUSTIC_LIGHT_COLORS,
  EARTHY_LIGHT_COLORS,
  PEACH_LIGHT_COLORS,
  SAND_LIGHT_COLORS,
  BOLD_DARK_COLORS,
  AUTUMN_DARK_COLORS,
  SCALE_DEFAULTS,
  DEFAULT_FONT,
  DEFAULT_FONT_MONO,
};

const INLINE_TOKEN_VARS = [
  "--space",
  "--size",
  "--radius",
  "--border-width",
  "--font-family-sans",
  "--font-family-mono",
  "--glass-blur",
  "--glass-saturate",
  "--shadow-size",
  "--shadow-none",
  "--shadow-sm",
  "--shadow-md",
  "--shadow-lg",
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
  root.style.setProperty("--glass-blur", `${state.glassBlur}px`);
  root.style.setProperty("--glass-saturate", String(state.glassSaturate));

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
  });

  applyTextScale(root, state.textScale);
  applyShadows(root, state.theme, state.shadowStrength, state.shadowSize);

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
    `  --glass-blur: ${state.glassBlur}px;`,
    `  --glass-saturate: ${state.glassSaturate};`,
    `  --shadow-size: ${state.shadowSize};`,
    `  /* textScale: ${state.textScale} — задайте --text-scale-* вручную или через applyThemeTokens */`,
    `  /* shadowStrength: ${state.shadowStrength}, shadowSize: ${state.shadowSize} */`,
  ];

  for (const [key, cssVar] of Object.entries(COLOR_CSS_VAR) as [ThemeColorKey, string][]) {
    if (key === "border" && !state.borderCustomized) {
      lines.push(
        `  /* ${cssVar}: ${BORDER_COLOR_CSS_FORMULA[state.theme]} — из tokens/styles.css */`,
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
