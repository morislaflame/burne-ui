import type { MotionConfig } from "@/components/core/utils/motionConfig";
import type { ToastProviderProps } from "@/components/core/Toast/toastTypes";

import {
  applyThemeTokens,
  createDefaultThemeState,
  exportThemeCss,
  type ThemeColors,
  type ThemeFontWeights,
  type ThemeMode,
  type ThemeStatusForegrounds,
  type ThemeTokenState,
} from "./themeDefaults";

/** Color mode for ThemeProvider / BurneUIProvider (`system` follows OS). */
export type BurneThemeMode = ThemeMode | "system";

/**
 * Runtime CSS token overrides. Omit fields to keep values from `burne-ui/styles.css`.
 * When exporting from the playground, all fields are filled for a faithful snapshot.
 */
export type ThemeTokenOverrides = {
  space?: number;
  size?: number;
  radius?: number;
  borderWidth?: number;
  textScale?: number;
  fontFamily?: string;
  fontFamilyMono?: string;
  fontWeights?: ThemeFontWeights;
  shadowStrength?: number;
  shadowSize?: number;
  toastScrimSize?: number;
  toastScrimDensity?: number;
  colors?: Partial<ThemeColors>;
  statusForegrounds?: Partial<ThemeStatusForegrounds>;
  /** When true, `--color-border` is set from `colors.border` instead of the CSS formula. */
  borderCustomized?: boolean;
};

/**
 * Serializable theme config for `BurneUIProvider`.
 * Generate via `exportBurneThemeConfigSource()` from the playground and save as e.g. `burne-theme.ts`.
 */
export type BurneThemeConfig = {
  /** @default "dark" */
  theme?: BurneThemeMode;
  /** localStorage key for theme preference. Pass `null` to disable persistence. */
  storageKey?: string | null;
  tokens?: ThemeTokenOverrides;
  motion?: Partial<MotionConfig>;
  /** Wrap children with `Toast.Provider`. @default true */
  toast?: boolean | Omit<ToastProviderProps, "children">;
};

const MOTION_STATE_KEYS = [
  "interactiveDuration",
  "interactiveEase",
  "hoverLiftEase",
  "tooltipDuration",
  "switchThumbDuration",
  "switchThumbEase",
  "selectionFillDuration",
  "selectionFillEase",
  "hoverLiftScale",
  "badgeAnchorHoverLiftScale",
  "rippleDefaultDuration",
  "rippleDefaultOpacityFrom",
  "rippleExpandableDuration",
  "rippleExpandableOpacityFrom",
  "rippleEaseCss",
  "feedbackExpandDuration",
  "expandDuration",
  "expandOpenEase",
  "progressFillDuration",
  "progressFillEase",
  "loadingDotsDuration",
  "loadingDotsEaseUp",
  "loadingDotsEaseDown",
  "enableHoverLift",
  "enablePressSqueeze",
  "enableToggleButtonFill",
  "enableRipple",
  "enableExpandable",
  "enableToastStack",
  "enableAsyncButtonCrossfade",
  "enableContentFade",
  "enableFeedbackExpand",
  "enableProgressFill",
  "enableLoadingDots",
] as const satisfies ReadonlyArray<keyof ThemeTokenState>;

/** Build a `BurneThemeConfig` snapshot from live playground state. */
export function themeTokenStateToConfig(state: ThemeTokenState): BurneThemeConfig {
  const motion: Partial<MotionConfig> = {
    interactiveDuration: state.interactiveDuration,
    interactiveEase: state.interactiveEase,
    hoverLiftEase: state.hoverLiftEase,
    tooltipDuration: state.tooltipDuration,
    switchThumbDuration: state.switchThumbDuration,
    switchThumbEase: state.switchThumbEase,
    selectionFillDuration: state.selectionFillDuration,
    selectionFillEase: state.selectionFillEase,
    hoverLiftScale: state.hoverLiftScale,
    badgeAnchorHoverLiftScale: state.badgeAnchorHoverLiftScale,
    pressSqueezeScale: [1, state.pressSqueezeMid, 1],
    rippleDefaultDuration: state.rippleDefaultDuration,
    rippleDefaultOpacityFrom: state.rippleDefaultOpacityFrom,
    rippleExpandableDuration: state.rippleExpandableDuration,
    rippleExpandableOpacityFrom: state.rippleExpandableOpacityFrom,
    rippleEaseCss: state.rippleEaseCss,
    feedbackExpandDuration: state.feedbackExpandDuration,
    expandDuration: state.expandDuration,
    expandOpenEase: state.expandOpenEase,
    progressFillDuration: state.progressFillDuration,
    progressFillEase: state.progressFillEase,
    loadingDotsDuration: state.loadingDotsDuration,
    loadingDotsEaseUp: state.loadingDotsEaseUp,
    loadingDotsEaseDown: state.loadingDotsEaseDown,
    enableHoverLift: state.enableHoverLift,
    enablePressSqueeze: state.enablePressSqueeze,
    enableToggleButtonFill: state.enableToggleButtonFill,
    enableRipple: state.enableRipple,
    enableExpandable: state.enableExpandable,
    enableToastStack: state.enableToastStack,
    enableAsyncButtonCrossfade: state.enableAsyncButtonCrossfade,
    enableContentFade: state.enableContentFade,
    enableFeedbackExpand: state.enableFeedbackExpand,
    enableProgressFill: state.enableProgressFill,
    enableLoadingDots: state.enableLoadingDots,
  };

  const tokens: ThemeTokenOverrides = {
    space: state.space,
    size: state.size,
    radius: state.radius,
    borderWidth: state.borderWidth,
    textScale: state.textScale,
    fontFamily: state.fontFamily,
    fontFamilyMono: state.fontFamilyMono,
    fontWeights: { ...state.fontWeights },
    shadowStrength: state.shadowStrength,
    shadowSize: state.shadowSize,
    toastScrimSize: state.toastScrimSize,
    toastScrimDensity: state.toastScrimDensity,
    colors: { ...state.colors },
    statusForegrounds: { ...state.statusForegrounds },
    borderCustomized: state.borderCustomized,
  };

  return {
    theme: state.theme,
    tokens,
    motion,
    toast: true,
  };
}

/** Merge token overrides into a full `ThemeTokenState` (for `applyThemeTokens`). */
export function mergeThemeTokenOverrides(
  overrides: ThemeTokenOverrides | undefined,
  theme: ThemeMode = "dark",
): ThemeTokenState {
  const base = createDefaultThemeState(theme);
  if (!overrides) return base;

  return {
    ...base,
    ...pickDefined({
      space: overrides.space,
      size: overrides.size,
      radius: overrides.radius,
      borderWidth: overrides.borderWidth,
      textScale: overrides.textScale,
      fontFamily: overrides.fontFamily,
      fontFamilyMono: overrides.fontFamilyMono,
      shadowStrength: overrides.shadowStrength,
      shadowSize: overrides.shadowSize,
      toastScrimSize: overrides.toastScrimSize,
      toastScrimDensity: overrides.toastScrimDensity,
      borderCustomized: overrides.borderCustomized,
    }),
    fontWeights: overrides.fontWeights
      ? { ...base.fontWeights, ...overrides.fontWeights }
      : base.fontWeights,
    colors: overrides.colors ? { ...base.colors, ...overrides.colors } : base.colors,
    statusForegrounds: overrides.statusForegrounds
      ? { ...base.statusForegrounds, ...overrides.statusForegrounds }
      : base.statusForegrounds,
    colorPreset: null,
  };
}

function pickDefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const out: Partial<T> = {};
  for (const [key, value] of Object.entries(obj) as [keyof T, T[keyof T]][]) {
    if (value !== undefined) out[key] = value;
  }
  return out;
}

/**
 * Apply a `BurneThemeConfig` to the document (tokens + motion via `applyThemeTokens`).
 * Theme mode `system` is resolved by `ThemeProvider` — pass the resolved `"light" | "dark"` here.
 */
export function applyBurneThemeConfig(
  config: BurneThemeConfig,
  root: HTMLElement = document.documentElement,
  resolvedTheme: ThemeMode = resolveConfigTheme(config.theme),
) {
  const state = mergeThemeTokenOverrides(config.tokens, resolvedTheme);

  if (config.motion) {
    const m = config.motion;
    if (m.interactiveDuration !== undefined) state.interactiveDuration = m.interactiveDuration;
    if (m.interactiveEase !== undefined) state.interactiveEase = m.interactiveEase;
    if (m.hoverLiftEase !== undefined) state.hoverLiftEase = m.hoverLiftEase;
    if (m.tooltipDuration !== undefined) state.tooltipDuration = m.tooltipDuration;
    if (m.switchThumbDuration !== undefined) state.switchThumbDuration = m.switchThumbDuration;
    if (m.switchThumbEase !== undefined) state.switchThumbEase = m.switchThumbEase;
    if (m.selectionFillDuration !== undefined) state.selectionFillDuration = m.selectionFillDuration;
    if (m.selectionFillEase !== undefined) state.selectionFillEase = m.selectionFillEase;
    if (m.hoverLiftScale !== undefined) state.hoverLiftScale = m.hoverLiftScale;
    if (m.badgeAnchorHoverLiftScale !== undefined) {
      state.badgeAnchorHoverLiftScale = m.badgeAnchorHoverLiftScale;
    }
    if (m.pressSqueezeScale !== undefined) state.pressSqueezeMid = m.pressSqueezeScale[1];
    if (m.rippleDefaultDuration !== undefined) state.rippleDefaultDuration = m.rippleDefaultDuration;
    if (m.rippleDefaultOpacityFrom !== undefined) {
      state.rippleDefaultOpacityFrom = m.rippleDefaultOpacityFrom;
    }
    if (m.rippleExpandableDuration !== undefined) {
      state.rippleExpandableDuration = m.rippleExpandableDuration;
    }
    if (m.rippleExpandableOpacityFrom !== undefined) {
      state.rippleExpandableOpacityFrom = m.rippleExpandableOpacityFrom;
    }
    if (m.rippleEaseCss !== undefined) state.rippleEaseCss = m.rippleEaseCss;
    if (m.feedbackExpandDuration !== undefined) state.feedbackExpandDuration = m.feedbackExpandDuration;
    if (m.expandDuration !== undefined) state.expandDuration = m.expandDuration;
    if (m.expandOpenEase !== undefined) state.expandOpenEase = m.expandOpenEase;
    if (m.progressFillDuration !== undefined) state.progressFillDuration = m.progressFillDuration;
    if (m.progressFillEase !== undefined) state.progressFillEase = m.progressFillEase;
    if (m.loadingDotsDuration !== undefined) state.loadingDotsDuration = m.loadingDotsDuration;
    if (m.loadingDotsEaseUp !== undefined) state.loadingDotsEaseUp = m.loadingDotsEaseUp;
    if (m.loadingDotsEaseDown !== undefined) state.loadingDotsEaseDown = m.loadingDotsEaseDown;
    if (m.enableHoverLift !== undefined) state.enableHoverLift = m.enableHoverLift;
    if (m.enablePressSqueeze !== undefined) state.enablePressSqueeze = m.enablePressSqueeze;
    if (m.enableToggleButtonFill !== undefined) state.enableToggleButtonFill = m.enableToggleButtonFill;
    if (m.enableRipple !== undefined) state.enableRipple = m.enableRipple;
    if (m.enableExpandable !== undefined) state.enableExpandable = m.enableExpandable;
    if (m.enableToastStack !== undefined) state.enableToastStack = m.enableToastStack;
    if (m.enableAsyncButtonCrossfade !== undefined) {
      state.enableAsyncButtonCrossfade = m.enableAsyncButtonCrossfade;
    }
    if (m.enableContentFade !== undefined) state.enableContentFade = m.enableContentFade;
    if (m.enableFeedbackExpand !== undefined) state.enableFeedbackExpand = m.enableFeedbackExpand;
    if (m.enableProgressFill !== undefined) state.enableProgressFill = m.enableProgressFill;
    if (m.enableLoadingDots !== undefined) state.enableLoadingDots = m.enableLoadingDots;
  }

  applyThemeTokens(state, root);
}

export function resolveConfigTheme(theme: BurneThemeMode | undefined): ThemeMode {
  if (theme === "light" || theme === "dark") return theme;
  if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: light)").matches) {
    return "light";
  }
  return "dark";
}

/** Alias: apply token overrides without a full config object. */
export function applyTokens(
  overrides: ThemeTokenOverrides,
  root: HTMLElement = document.documentElement,
  theme: ThemeMode = "dark",
) {
  applyBurneThemeConfig({ theme, tokens: overrides }, root, theme);
}

/** CSS string for `burne-theme-overrides.css` (same as playground “Copy CSS”). */
export function exportBurneThemeCss(config: BurneThemeConfig): string {
  const theme = resolveConfigTheme(config.theme === "system" ? undefined : config.theme);
  const state = mergeThemeTokenOverrides(config.tokens, theme);
  return exportThemeCss(state);
}

function stringifyValue(value: unknown, indent: number): string {
  const pad = "  ".repeat(indent);
  const padIn = "  ".repeat(indent + 1);

  if (value === null || value === undefined) return "undefined";
  if (typeof value === "boolean" || typeof value === "number") return String(value);
  if (typeof value === "string") return JSON.stringify(value);

  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const items = value.map((item) => `${padIn}${stringifyValue(item, indent + 1)}`);
    return `[\n${items.join(",\n")},\n${pad}]`;
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).filter(
      ([, v]) => v !== undefined,
    );
    if (entries.length === 0) return "{}";
    const lines = entries.map(
      ([k, v]) => `${padIn}${safeKey(k)}: ${stringifyValue(v, indent + 1)}`,
    );
    return `{\n${lines.join(",\n")},\n${pad}}`;
  }

  return JSON.stringify(value);
}

function safeKey(key: string): string {
  return /^[A-Za-z_$][\w$]*$/.test(key) ? key : JSON.stringify(key);
}

/**
 * TypeScript source for a project file (e.g. `burne-theme.ts`).
 * Paste into the project and pass to `<BurneUIProvider config={burneTheme} />`.
 */
export function exportBurneThemeConfigSource(
  config: BurneThemeConfig,
  options?: { exportName?: string },
): string {
  const exportName = options?.exportName ?? "burneTheme";
  const body = stringifyValue(config, 0);

  return [
    "/**",
    " * Generated from the Burne UI theme playground.",
    " * Save as `burne-theme.ts` (or similar) and pass to BurneUIProvider:",
    " *",
    " *   import { BurneUIProvider } from \"burne-ui\";",
    ` *   import ${exportName} from \"./burne-theme\";`,
    " *",
    ` *   <BurneUIProvider config={${exportName}}>{children}</BurneUIProvider>`,
    " */",
    'import type { BurneThemeConfig } from "burne-ui";',
    "",
    `const ${exportName} = ${body} satisfies BurneThemeConfig;`,
    "",
    `export default ${exportName};`,
    "",
  ].join("\n");
}

/** @internal used by docs — list of motion keys mirrored from ThemeTokenState */
export const BURNE_THEME_MOTION_STATE_KEYS = MOTION_STATE_KEYS;
