export type ThemeMode = "dark" | "light";

export type ThemeColorKey =
  | "background"
  | "surface"
  | "secondary"
  | "tertiary"
  | "border"
  | "foreground"
  | "muted"
  | "primary"
  | "primaryForeground"
  | "primaryTint"
  | "primaryTintStrong"
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
  durationFast: number;
  durationNormal: number;
  glassBlur: number;
  glassSaturate: number;
  colors: ThemeColors;
  statusForegrounds: ThemeStatusForegrounds;
};

export const COLOR_CSS_VAR: Record<ThemeColorKey, string> = {
  background: "--color-background",
  surface: "--color-surface",
  secondary: "--color-secondary-bg",
  tertiary: "--color-tertiary-bg",
  border: "--color-border",
  foreground: "--color-foreground",
  muted: "--color-muted",
  primary: "--color-primary",
  primaryForeground: "--color-primary-foreground",
  primaryTint: "--color-primary-tint",
  primaryTintStrong: "--color-primary-tint-strong",
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
  secondary: "#25282d",  // mix(foreground 8%, surface)
  tertiary: "#2e3239",   // mix(foreground 12%, surface)
  border: "#2a2d36",
  foreground: "#f4f5f7",
  muted: "#8b90a0",
  primary: "#ebebef",
  primaryForeground: "#0c0c0e",
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
  background: "#fafafa",
  surface: "#ffffff",
  secondary: "#ebebec",  // mix(foreground 8%, surface)
  tertiary: "#e2e2e4",   // mix(foreground 12%, surface)
  border: "#e4e4e7",
  foreground: "#18181b",
  muted: "#71717a",
  primary: "#18181b",
  primaryForeground: "#fafafa",
  indicator: "#18181b",
  indicatorForeground: "#fafafa",
  danger: "#dc2626",
  success: "#22c55e",
  info: "#0ea5e9",
  warning: "#f59e0b",
  primaryTint: PRIMARY_TINT,
  primaryTintStrong: PRIMARY_TINT_STRONG,
};

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
  /** Радиус в пикселях (0–100) */
  radius: 8,
  borderWidth: 1,
  textScale: 1,
  shadowStrength: 1,
  durationFast: 150,
  durationNormal: 250,
  glassBlur: 22,
  glassSaturate: 1.45,
} as const;

/** Наборы только scale-значений для лейаут-пресетов. Не трогают цвета. */
export const LAYOUT_PRESETS = {
  compact:  { space: 0.4,   size: 0.9,   radius: 6,  borderWidth: 1, textScale: 0.95 },
  spacious: { space: 0.625, size: 1.125, radius: 10, borderWidth: 1, textScale: 1.05 },
  flat:     { space: 0.5,   size: 1,     radius: 6,  borderWidth: 0, textScale: 1 },
} as const;

export type LayoutPresetKey = keyof typeof LAYOUT_PRESETS;

/** Ключи цветовых пресетов — при применении не затрагивают scale-значения. */
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

function applyShadows(root: HTMLElement, theme: ThemeMode, strength: number) {
  const base = SHADOW_BASE[theme];
  const [smA, smB] = base.sm;
  const [mdA, mdB] = base.md;
  const [lgA, lgB] = base.lg;
  root.style.setProperty(
    "--shadow-sm",
    `0 1px 3px 0 rgb(0 0 0 / ${smA * strength}), 0 1px 2px -1px rgb(0 0 0 / ${smB * strength})`,
  );
  root.style.setProperty(
    "--shadow-md",
    `0 3px 8px -1px rgb(0 0 0 / ${mdA * strength}), 0 2px 4px -2px rgb(0 0 0 / ${mdB * strength})`,
  );
  root.style.setProperty(
    "--shadow-lg",
    `0 8px 20px -4px rgb(0 0 0 / ${lgA * strength}), 0 4px 8px -4px rgb(0 0 0 / ${lgB * strength})`,
  );
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
  };
}

// ─── Цветовые наборы для пресетов ──────────────────────────────────────────

const OCEAN_DARK_COLORS: ThemeColors = {
  background: "#0c0d10",
  surface: "#0d1826",
  secondary: "#202a37",  // mix(fg8%+surface)
  tertiary: "#283442",   // mix(fg12%+surface)
  border: "#2a2d36",
  foreground: "#f4f5f7",
  muted: "#8b90a0",
  primary: "#38bdf8",
  primaryForeground: "#000000",
  indicator: "#06b6d4",
  indicatorForeground: "#03111f",
  danger: "#dc2626",
  success: "#22c55e",
  info: "#0ea5e9",
  warning: "#f59e0b",
  primaryTint: PRIMARY_TINT,
  primaryTintStrong: PRIMARY_TINT_STRONG,
};

const VIOLET_DARK_COLORS: ThemeColors = {
  background: "#0c0d10",
  surface: "#16122a",
  secondary: "#28243a",  // mix(fg8%+surface)
  tertiary: "#312d45",   // mix(fg12%+surface)
  border: "#2a2d36",
  foreground: "#f4f5f7",
  muted: "#8b90a0",
  primary: "#5a189a",
  primaryForeground: "#f4f5f7",
  indicator: "#8b5cf6",
  indicatorForeground: "#ffffff",
  danger: "#dc2626",
  success: "#22c55e",
  info: "#0ea5e9",
  warning: "#f59e0b",
  primaryTint: PRIMARY_TINT,
  primaryTintStrong: PRIMARY_TINT_STRONG,
};

const EMERALD_DARK_COLORS: ThemeColors = {
  background: "#0c0d10",
  surface: "#0c221c",
  secondary: "#1f332e",  // mix(fg8%+surface)
  tertiary: "#273d38",   // mix(fg12%+surface)
  border: "#2a2d36",
  foreground: "#f4f5f7",
  muted: "#8b90a0",
  primary: "#34d399",
  primaryForeground: "#f4f5f7",
  indicator: "#10b981",
  indicatorForeground: "#061410",
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
  secondary: "#ebebec",  // mix(fg8%+surface)
  tertiary: "#e2e2e4",   // mix(fg12%+surface)
  border: "#fecdd3",
  foreground: "#18181b",
  muted: "#71717a",
  primary: "#f43f5e",
  primaryForeground: "#ffffff",
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
  secondary: "#ebebec",  // mix(fg8%+surface)
  tertiary: "#e2e2e4",   // mix(fg12%+surface)
  border: "#fde68a",
  foreground: "#18181b",
  muted: "#71717a",
  primary: "#d97706",
  primaryForeground: "#ffffff",
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
  secondary: "#ebebec",  // mix(fg8%+surface)
  tertiary: "#e2e2e4",   // mix(fg12%+surface)
  border: "#e2e8f0",
  foreground: "#18181b",
  muted: "#71717a",
  primary: "#6366f1",
  primaryForeground: "#ffffff",
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
  background: "#ede0d4",   // Almond Cream — страница / панели
  surface: "#f8f3ee",      // светлее Almond Cream — фон контролов
  secondary: "#e8e1dc",    // mix(fg8%+surface) тёплый кремовый
  tertiary: "#e0d9d4",     // mix(fg12%+surface)
  border: "#b08968",       // Faded Copper — хороший контраст на cream
  foreground: "#2d1208",   // очень тёмный тёплый коричневый
  muted: "#9c6644",        // Toffee Brown
  primary: "#7f5539",      // Coffee Bean
  primaryForeground: "#f8f3ee",
  indicator: "#9c6644",    // Toffee Brown
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
  background: "#f1e4df",   // Almond Silk — страница / панели
  surface: "#f5ece6",      // светлее Almond Silk — фон контролов
  secondary: "#e5dad4",    // mix(fg8%+surface)
  tertiary: "#ddd2cc",     // mix(fg12%+surface)
  border: "#da9f93",       // Rosy Taupe
  foreground: "#2c0703",   // Rich Mahogany — насыщенный тёмный текст
  muted: "#7a3040",        // производный между Rosy Taupe и Berry Crush
  primary: "#b6465f",      // Berry Crush
  primaryForeground: "#ffffff",
  indicator: "#890620",    // Burgundy — глубже для индикаторов выбора
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
  background: "#d6cbc1",   // Bone — страница
  surface: "#ede8e2",      // светлее Bone — фон контролов
  secondary: "#ddd6d0",    // mix(fg8%+surface)
  tertiary: "#d5cec8",     // mix(fg12%+surface)
  border: "#dcb5a7",       // Dust Grey — прохладный контраст к тёплому фону
  foreground: "#200d06",   // очень тёмный тёплый
  muted: "#9a6a5e",        // производный из Powder Blush
  primary: "#e16036",      // Spicy Paprika
  primaryForeground: "#ffffff",
  indicator: "#e3170a",    // Burnt Tangerine — более насыщенный для индикаторов
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
  background: "#f5e8e8",   // производный very light rose (из духа палитры)
  surface: "#fff0ee",      // near-white с тёплым розовым оттенком
  secondary: "#eededd",    // mix(fg8%+surface)
  tertiary: "#e6d6d5",     // mix(fg12%+surface)
  border: "#e8bfb8",       // производный светло-красный
  foreground: "#250902",   // Rich Mahogany — самый тёмный, читаемый текст
  muted: "#8a4540",        // производный приглушённый тёмно-красный
  primary: "#ad2831",      // Brown Red — самый яркий в палитре, хороший контраст 6:1
  primaryForeground: "#ffffff",
  indicator: "#800e13",    // Dark Wine — глубже для индикаторов
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
  background: "#f6f3ef",   // Silver — страница
  surface: "#fffcf2",      // Floral White — контролы
  secondary: "#f5f0e8",    // mix(fg8%+surface)
  tertiary: "#ede8df",     // mix(fg12%+surface)
  border: "#8a837a",       // производный Silver/Charcoal
  foreground: "#252422",   // Carbon Black
  muted: "#403d39",        // Charcoal Brown
  primary: "#eb5e28",      // Spicy Paprika
  primaryForeground: "#fffcf2",
  indicator: "#c94a1e",    // глубже Paprika
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
  background: "#faf9f5",   // Vanilla Cream
  surface: "#f8f4e8",      // светлее Vanilla Cream
  secondary: "#ece6d4",    // mix(fg8%+surface)
  tertiary: "#e4ddd0",     // mix(fg12%+surface)
  border: "#a98467",       // Faded Copper
  foreground: "#3d3228",   // производный Ash Brown
  muted: "#6c584c",        // Ash Brown
  primary: "#adc178",      // Faded Copper
  primaryForeground: "#0d0d0d",
  indicator: "#6c584c",     // Ash Brown
  indicatorForeground: "#f8f4e8",
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
  background: "#ffffff",   // Soft Apricot
  surface: "#fff5ee",      // светлее Apricot
  secondary: "#fce8dc",    // mix(fg8%+surface)
  tertiary: "#f8e0d4",     // mix(fg12%+surface)
  border: "#f8ad9d",       // Powder Blush
  foreground: "#5c2d2d",   // тёплый тёмный
  muted: "#c97a7a",        // производный Coral
  primary: "#f08080",      // Light Coral
  primaryForeground: "#ffffff",
  indicator: "#e06b6b",    // глубже Coral
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
  background: "#edede9",   // Bone
  surface: "#f5ebe0",      // Linen
  secondary: "#ebe3d8",    // mix(fg8%+surface)
  tertiary: "#e3d9ce",     // mix(fg12%+surface)
  border: "#d5bdaf",       // Almond Silk
  foreground: "#3a342f",   // тёплый тёмный
  muted: "#8a7f76",        // производный Bone
  primary: "#9a846f",      // производный Almond Silk
  primaryForeground: "#f5ebe0",
  indicator: "#7a6a58",    // глубже для индикаторов
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
  secondary: "#1c1a38",    // mix(fg8%+surface)
  tertiary: "#242042",     // mix(fg12%+surface)
  border: "#2c1b55",       // Vivid Royal (тонированный)
  foreground: "#f0f4ff",
  muted: "#8899cc",
  primary: "#f72585",      // Neon Pink
  primaryForeground: "#ffffff",
  indicator: "#f72585",    // Electric Sapphire
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
  background: "#01141e",   // Deep Space Blue
  surface: "#0a2840",      // светлее космический синий
  secondary: "#123350",    // mix(fg8%+surface)
  tertiary: "#1a3d5c",     // mix(fg12%+surface)
  border: "#1a4a6e",       // производный Deep Space
  foreground: "#f9f6e7",   // Vanilla Custard
  muted: "#a8c4d4",        // приглушённый голубой
  primary: "#d62828",      // Princeton Orange
  primaryForeground: "#f4f8fb",
  indicator: "#d62828",    // Sunflower Gold
  indicatorForeground: "#003049",
  danger: "#d62828",       // Flag Red
  success: "#22c55e",
  info: "#4cc9f0",
  warning: "#fcbf49",
  primaryTint: AUTUMN_PRIMARY_TINT,
  primaryTintStrong: AUTUMN_PRIMARY_TINT_STRONG,
};

/** Полные цветовые пресеты (без scale-значений — scale берётся из текущего состояния при применении) */
export const THEME_PRESETS = {
  dark: createDefaultThemeState("dark"),
  light: createDefaultThemeState("light"),
  contrast: {
    ...createDefaultThemeState("dark"),
    colors: {
      ...DARK_COLORS,
      foreground: "#ffffff",
      secondary: "#282a2e",  // mix(white8%+surface)
      tertiary: "#313438",   // mix(white12%+surface)
      muted: "#a8adb8",
      primary: "#ffffff",
      primaryForeground: "#0c0c0e",
      indicator: "#ffffff",
      indicatorForeground: "#0c0c0e",
      border: "#3d4250",
    },
    shadowStrength: 1.25,
  },
  ocean: {
    ...createDefaultThemeState("dark"),
    colors: OCEAN_DARK_COLORS,
    statusForegrounds: { ...DARK_STATUS_FOREGROUNDS },
  },
  violet: {
    ...createDefaultThemeState("dark"),
    colors: VIOLET_DARK_COLORS,
    statusForegrounds: { ...DARK_STATUS_FOREGROUNDS },
  },
  emerald: {
    ...createDefaultThemeState("dark"),
    colors: EMERALD_DARK_COLORS,
    statusForegrounds: { ...DARK_STATUS_FOREGROUNDS },
  },
  rose: {
    ...createDefaultThemeState("light"),
    colors: ROSE_LIGHT_COLORS,
    statusForegrounds: { ...LIGHT_STATUS_FOREGROUNDS },
  },
  amber: {
    ...createDefaultThemeState("light"),
    colors: AMBER_LIGHT_COLORS,
    statusForegrounds: { ...LIGHT_STATUS_FOREGROUNDS },
  },
  slate: {
    ...createDefaultThemeState("light"),
    colors: SLATE_LIGHT_COLORS,
    statusForegrounds: { ...LIGHT_STATUS_FOREGROUNDS },
  },
  // ─── Новые палитры ──────────────────────────────────────────────────────────
  toffee: {
    ...createDefaultThemeState("light"),
    colors: TOFFEE_LIGHT_COLORS,
    statusForegrounds: { ...LIGHT_STATUS_FOREGROUNDS },
  },
  berry: {
    ...createDefaultThemeState("light"),
    colors: BERRY_LIGHT_COLORS,
    statusForegrounds: { ...LIGHT_STATUS_FOREGROUNDS },
  },
  paprika: {
    ...createDefaultThemeState("light"),
    colors: PAPRIKA_LIGHT_COLORS,
    statusForegrounds: { ...LIGHT_STATUS_FOREGROUNDS },
  },
  cherry: {
    ...createDefaultThemeState("light"),
    colors: CHERRY_LIGHT_COLORS,
    statusForegrounds: { ...LIGHT_STATUS_FOREGROUNDS },
  },
  rustic: {
    ...createDefaultThemeState("light"),
    colors: RUSTIC_LIGHT_COLORS,
    statusForegrounds: { ...LIGHT_STATUS_FOREGROUNDS },
  },
  earthy: {
    ...createDefaultThemeState("light"),
    colors: EARTHY_LIGHT_COLORS,
    statusForegrounds: { ...LIGHT_STATUS_FOREGROUNDS },
  },
  peach: {
    ...createDefaultThemeState("light"),
    colors: PEACH_LIGHT_COLORS,
    statusForegrounds: { ...LIGHT_STATUS_FOREGROUNDS },
  },
  sand: {
    ...createDefaultThemeState("light"),
    colors: SAND_LIGHT_COLORS,
    statusForegrounds: { ...LIGHT_STATUS_FOREGROUNDS },
  },
  bold: {
    ...createDefaultThemeState("dark"),
    colors: BOLD_DARK_COLORS,
    statusForegrounds: { ...DARK_STATUS_FOREGROUNDS },
  },
  autumn: {
    ...createDefaultThemeState("dark"),
    colors: AUTUMN_DARK_COLORS,
    statusForegrounds: { ...DARK_STATUS_FOREGROUNDS },
  },
} as const satisfies Record<string, ThemeTokenState>;

const INLINE_TOKEN_VARS = [
  "--space",
  "--size",
  "--radius",
  "--border-width",
  "--font-family-sans",
  "--font-family-mono",
  "--duration-fast",
  "--duration-normal",
  "--glass-blur",
  "--glass-saturate",
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
  delete root.dataset.brnTheme;
}

export function applyThemeTokens(state: ThemeTokenState, root: HTMLElement = document.documentElement) {
  if (state.theme === "light") {
    root.dataset.brnTheme = "light";
  } else {
    delete root.dataset.brnTheme;
  }

  root.style.setProperty("--space", `${state.space}rem`);
  root.style.setProperty("--size", `${state.size}rem`);
  root.style.setProperty("--radius", `${state.radius}px`);
  root.style.setProperty("--border-width", state.borderWidth === 0 ? "0px" : `${state.borderWidth}px`);
  root.style.setProperty("--font-family-sans", state.fontFamily);
  root.style.setProperty("--font-family-mono", state.fontFamilyMono);
  root.style.setProperty("--duration-fast", `${state.durationFast}ms`);
  root.style.setProperty("--duration-normal", `${state.durationNormal}ms`);
  root.style.setProperty("--glass-blur", `${state.glassBlur}px`);
  root.style.setProperty("--glass-saturate", String(state.glassSaturate));

  applyTextScale(root, state.textScale);
  applyShadows(root, state.theme, state.shadowStrength);

  for (const [key, cssVar] of Object.entries(COLOR_CSS_VAR) as [ThemeColorKey, string][]) {
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
    `  --radius: ${state.radius}px;`,
    `  --border-width: ${state.borderWidth === 0 ? "0px" : `${state.borderWidth}px`};`,
    `  --font-family-sans: ${state.fontFamily};`,
    `  --font-family-mono: ${state.fontFamilyMono};`,
    `  --duration-fast: ${state.durationFast}ms;`,
    `  --duration-normal: ${state.durationNormal}ms;`,
    `  --glass-blur: ${state.glassBlur}px;`,
    `  --glass-saturate: ${state.glassSaturate};`,
    `  /* textScale: ${state.textScale} — задайте --text-scale-* вручную или через applyThemeTokens */`,
    `  /* shadowStrength: ${state.shadowStrength} */`,
  ];

  for (const [key, cssVar] of Object.entries(COLOR_CSS_VAR) as [ThemeColorKey, string][]) {
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
    lines.push('/* <html data-brn-theme="light"> */');
  }

  return lines.join("\n");
}
