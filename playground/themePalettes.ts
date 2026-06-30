import type { ThemeColors, ThemeStatusForegrounds } from "./themeDefaults";

// ─── Tint formulas (как в tokens/styles.css) ─────────────────────────────────


/** Как в tokens/styles.css — следует при смене primary через var(). */
export const PRIMARY_TINT = "color-mix(in oklab, var(--color-primary) 20%, transparent)";
export const PRIMARY_TINT_STRONG = "color-mix(in oklab, var(--color-primary) 25%, transparent)";

/** Bold — mix с surface на тёмном фоне. */
export const BOLD_PRIMARY_TINT = "color-mix(in oklab, var(--color-primary) 16%, var(--color-surface))";
export const BOLD_PRIMARY_TINT_STRONG = "color-mix(in oklab, #4361ee 24%, var(--color-surface))";

/** Autumn — тёплый strong-tint из Sunflower Gold. */
export const AUTUMN_PRIMARY_TINT = "color-mix(in oklab, var(--color-primary) 14%, var(--color-surface))";
export const AUTUMN_PRIMARY_TINT_STRONG = "color-mix(in oklab, #fcbf49 22%, var(--color-surface))";

/** Как в tokens/styles.css — border от foreground (dark и light). */
export const BORDER_COLOR_CSS_FORMULA =
  "color-mix(in oklab, var(--color-foreground) 12%, transparent)";

// ─── Base palettes ───────────────────────────────────────────────────────────

export const DARK_COLORS: ThemeColors = {
  background: "#0c0d10",
  surface: "#171717",
  secondary: "#2D2D2D",
  secondaryForeground: "#f4f5f7",
  tertiary: "#454545",
  tertiaryForeground: "#f4f5f7",
  border: BORDER_COLOR_CSS_FORMULA,
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

export const LIGHT_COLORS: ThemeColors = {
  background: "#f5f5f5",
  surface: "#ffffff",
  secondary: "#ebebec",
  secondaryForeground: "#18181b",
  tertiary: "#e2e2e4",
  tertiaryForeground: "#18181b",
  border: BORDER_COLOR_CSS_FORMULA,
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

export const DARK_STATUS_FOREGROUNDS: ThemeStatusForegrounds = {
  dangerForeground: "#fafafa",
  successForeground: "#fafafa",
  infoForeground: "#fafafa",
  warningForeground: "#0c0c0e",
};

export const LIGHT_STATUS_FOREGROUNDS: ThemeStatusForegrounds = {
  dangerForeground: "#ffffff",
  successForeground: "#ffffff",
  infoForeground: "#ffffff",
  warningForeground: "#0c0c0e",
};

function withTints(
  colors: Omit<ThemeColors, "primaryTint" | "primaryTintStrong">,
  tintStrong?: string,
): ThemeColors {
  return {
    ...colors,
    primaryTint: PRIMARY_TINT,
    primaryTintStrong: tintStrong ?? PRIMARY_TINT_STRONG,
  };
}

// ─── Named preset palettes ───────────────────────────────────────────────────

export const OCEAN_DARK_COLORS: ThemeColors = {
  background: "#0c0d10",
  surface: "#16191d",
  secondary: "#202a37",
  secondaryForeground: "#f4f5f7",
  tertiary: "#283442",
  tertiaryForeground: "#f4f5f7",
  border: BORDER_COLOR_CSS_FORMULA,
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

export const VIOLET_DARK_COLORS: ThemeColors = {
  background: "#0c0d10",
  surface: "#17161d",
  secondary: "#28243a",
  secondaryForeground: "#f4f5f7",
  tertiary: "#312d45",
  tertiaryForeground: "#f4f5f7",
  border: BORDER_COLOR_CSS_FORMULA,
  foreground: "#f4f5f7",
  muted: "#8b90a0",
  primary: "#a354f2",
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

export const EMERALD_DARK_COLORS: ThemeColors = {
  background: "#0c0d10",
  surface: "#121716",
  secondary: "#1f332e",
  secondaryForeground: "#f4f5f7",
  tertiary: "#273d38",
  tertiaryForeground: "#f4f5f7",
  border: BORDER_COLOR_CSS_FORMULA,
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

export const ROSE_LIGHT_COLORS: ThemeColors = {
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

export const AMBER_LIGHT_COLORS: ThemeColors = {
  background: "#fafafa",
  surface: "#ffffff",
  secondary: "#ebebec",
  secondaryForeground: "#18181b",
  tertiary: "#e2e2e4",
  tertiaryForeground: "#18181b",
  border: "#f8e0c4",
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

export const SLATE_LIGHT_COLORS: ThemeColors = {
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


// ─── Extended palettes ──────────────────────────────────────────────────────────

/**
 * Toffee — тёплая кремово-коричневая светлая тема.
 * Palette: Almond Cream → Desert Sand → Tan → Faded Copper → Coffee Bean → Toffee Brown
 */
export const TOFFEE_LIGHT_COLORS: ThemeColors = {
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
export const BERRY_LIGHT_COLORS: ThemeColors = {
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
export const PAPRIKA_LIGHT_COLORS: ThemeColors = {
  background: "#ede0d4",
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
export const CHERRY_LIGHT_COLORS: ThemeColors = {
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
export const RUSTIC_LIGHT_COLORS: ThemeColors = {
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
export const EARTHY_LIGHT_COLORS: ThemeColors = {
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
export const PEACH_LIGHT_COLORS: ThemeColors = {
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
export const SAND_LIGHT_COLORS: ThemeColors = {
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
export const BOLD_DARK_COLORS: ThemeColors = {
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
export const AUTUMN_DARK_COLORS: ThemeColors = {
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

export const CONTRAST_DARK_COLORS: ThemeColors = {
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

// ─── Light variants ──────────────────────────────────────────────────────────

export const OCEAN_LIGHT_COLORS: ThemeColors = withTints({
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

export const VIOLET_LIGHT_COLORS: ThemeColors = withTints({
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

export const EMERALD_LIGHT_COLORS: ThemeColors = withTints({
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

export const ROSE_DARK_COLORS: ThemeColors = withTints({
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

export const AMBER_DARK_COLORS: ThemeColors = withTints({
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

export const SLATE_DARK_COLORS: ThemeColors = withTints({
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

export const TOFFEE_DARK_COLORS: ThemeColors = withTints({
  background: "#130d06",
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

export const BERRY_DARK_COLORS: ThemeColors = withTints({
  background: "#0c0306",
  surface: "#240f16",
  secondary: "#281218",
  tertiaryForeground: "#f5ece6",
  secondaryForeground: "#f5ece6",
  tertiary: "#321820",
  border: "#37252b",
  foreground: "#f5ece6",
  muted: "#c97a88",
  primary: "#db4852",
  primaryForeground: "#ffffff",
  focusRing: "#b6465f",
  indicator: "#890620",
  indicatorForeground: "#ffffff",
  danger: "#dc2626",
  success: "#22c55e",
  info: "#0ea5e9",
  warning: "#d97706",
});

export const PAPRIKA_DARK_COLORS: ThemeColors = withTints({
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

export const CHERRY_DARK_COLORS: ThemeColors = withTints({
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

export const RUSTIC_DARK_COLORS: ThemeColors = withTints({
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

export const EARTHY_DARK_COLORS: ThemeColors = withTints({
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

export const PEACH_DARK_COLORS: ThemeColors = withTints({
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

export const SAND_DARK_COLORS: ThemeColors = withTints({
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

export const BOLD_LIGHT_COLORS: ThemeColors = {
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
  primaryTint: BOLD_PRIMARY_TINT,
  primaryTintStrong: BOLD_PRIMARY_TINT_STRONG,
};

export const AUTUMN_LIGHT_COLORS: ThemeColors = {
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
  primaryTint: AUTUMN_PRIMARY_TINT,
  primaryTintStrong: AUTUMN_PRIMARY_TINT_STRONG,
};

export const CONTRAST_LIGHT_COLORS: ThemeColors = withTints({
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