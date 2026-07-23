import type { MotionConfig } from "@/components/core/utils/motionConfig";
import type { ToastProviderProps } from "@/components/core/Toast/toastTypes";

import type { BurneLabels } from "./burneLabels";
import { applyThemeTokens, createDefaultThemeState, ensureModePalettes, exportThemeCss, type ThemeColors, type ThemeFontWeights, type ThemeMode, type ThemeTokenState } from "./themeDefaults";

/** Color mode for ThemeProvider / BurneUIProvider (`system` follows OS). */
export type BurneThemeMode = ThemeMode | "system";

/** Default `localStorage` key for theme persistence. */
export const DEFAULT_THEME_STORAGE_KEY = "burne-ui-theme";

/**
 * Shared (mode-independent) token overrides.
 * Colors live only under `BurneThemeConfig.colors`.
 */
export type ThemeTokenOverrides = {
  space?: number;
  size?: number;
  radius?: number;
  borderWidth?: number;
  focusRingWidth?: number;
  focusRingOffset?: number;
  textScale?: number;
  fontFamily?: string;
  fontFamilyMono?: string;
  fontWeights?: ThemeFontWeights;
  shadowStrength?: number;
  shadowSize?: number;
  toastScrimSize?: number;
  toastScrimDensity?: number;
};

/** Per-mode flat palette (status + hover included as regular keys). */
export type ThemeModeColorOverrides = ThemeColors | Partial<ThemeColors>;

export type CustomThemeTokenValue = string | number | boolean;

export type CustomThemeTokenControl =
  | "color"
  | "number"
  | "select"
  | "slider"
  | "switch"
  | "text";

export type CustomThemeTokenDefinition = {
  /** Shared value. Use `values` when light and dark need different values. */
  value?: CustomThemeTokenValue;
  values?: Partial<Record<ThemeMode, CustomThemeTokenValue>>;
  label?: string;
  group?: string;
  control?: CustomThemeTokenControl;
  description?: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: readonly (string | { label: string; value: string })[];
};

/**
 * Project-specific CSS variables. Keys must be valid custom properties (`--*`).
 * Primitive values get an inferred devtools control; use a definition for metadata.
 */
export type CustomThemeTokens = Record<
  `--${string}`,
  CustomThemeTokenValue | CustomThemeTokenDefinition
>;

/**
 * Serializable theme config for `BurneUIProvider`.
 * Generate via `exportBurneThemeConfigSource()` from the playground.
 *
 * - `tokens` / `motion` — shared across light & dark
 * - `colors.light` / `colors.dark` — flat palettes
 */
export type BurneThemeConfig = {
  /** @default "dark" */
  theme?: BurneThemeMode;
  /** localStorage key for theme preference. Pass `null` to disable persistence. */
  storageKey?: string | null;
  tokens?: ThemeTokenOverrides;
  colors?: Partial<Record<ThemeMode, ThemeModeColorOverrides>>;
  customTokens?: CustomThemeTokens;
  motion?: Partial<MotionConfig>;
  /** Wrap children with `Toast.Provider`. @default true */
  toast?: boolean | Omit<ToastProviderProps, "children">;
  /**
   * Override default accessible / UI strings (Close, Search, Pagination, …).
   * Merged over English defaults. See `DEFAULT_BURNE_LABELS` / `BURNE_LABELS_RU`.
   */
  labels?: Partial<BurneLabels>;
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
  "surfaceTransitionDuration",
  "toastDismissDuration",
  "toastDismissEase",
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

/** Merge shared `tokens` with `colors[mode]` into a full `ThemeTokenState`. */
export function resolveThemeTokenState(
  config: Pick<BurneThemeConfig, "tokens" | "colors">,
  mode: ThemeMode,
): ThemeTokenState {
  const base = createDefaultThemeState(mode);
  const shared = config.tokens ?? {};
  const modeOverrides = config.colors?.[mode];

  const colors: ThemeColors = modeOverrides
    ? { ...base.colors, ...modeOverrides }
    : base.colors;
  const shadowStrength = shared.shadowStrength ?? base.shadowStrength;

  return {
    ...base,
    ...pickDefined({
      space: shared.space,
      size: shared.size,
      radius: shared.radius,
      borderWidth: shared.borderWidth,
      focusRingWidth: shared.focusRingWidth,
      focusRingOffset: shared.focusRingOffset,
      textScale: shared.textScale,
      fontFamily: shared.fontFamily,
      fontFamilyMono: shared.fontFamilyMono,
      shadowSize: shared.shadowSize,
      toastScrimSize: shared.toastScrimSize,
      toastScrimDensity: shared.toastScrimDensity,
    }),
    shadowStrength,
    fontWeights: shared.fontWeights
      ? { ...base.fontWeights, ...shared.fontWeights }
      : base.fontWeights,
    colors,
    modePalettes: {
      ...base.modePalettes,
      [mode]: { ...colors },
    },
  };
}

/** Build a `BurneThemeConfig` snapshot from live playground state. */
export function themeTokenStateToConfig(state: ThemeTokenState): BurneThemeConfig {
  const withPalettes = ensureModePalettes(state);

  const motion: Partial<MotionConfig> = {
    interactiveDuration: withPalettes.interactiveDuration,
    interactiveEase: withPalettes.interactiveEase,
    hoverLiftEase: withPalettes.hoverLiftEase,
    tooltipDuration: withPalettes.tooltipDuration,
    switchThumbDuration: withPalettes.switchThumbDuration,
    switchThumbEase: withPalettes.switchThumbEase,
    selectionFillDuration: withPalettes.selectionFillDuration,
    selectionFillEase: withPalettes.selectionFillEase,
    hoverLiftScale: withPalettes.hoverLiftScale,
    badgeAnchorHoverLiftScale: withPalettes.badgeAnchorHoverLiftScale,
    pressSqueezeScale: [1, withPalettes.pressSqueezeMid, 1],
    rippleDefaultDuration: withPalettes.rippleDefaultDuration,
    rippleDefaultOpacityFrom: withPalettes.rippleDefaultOpacityFrom,
    rippleExpandableDuration: withPalettes.rippleExpandableDuration,
    rippleExpandableOpacityFrom: withPalettes.rippleExpandableOpacityFrom,
    rippleEaseCss: withPalettes.rippleEaseCss,
    feedbackExpandDuration: withPalettes.feedbackExpandDuration,
    expandDuration: withPalettes.expandDuration,
    expandOpenEase: withPalettes.expandOpenEase,
    surfaceTransitionDuration: withPalettes.surfaceTransitionDuration,
    toastDismissDuration: withPalettes.toastDismissDuration,
    toastDismissEase: withPalettes.toastDismissEase,
    progressFillDuration: withPalettes.progressFillDuration,
    progressFillEase: withPalettes.progressFillEase,
    loadingDotsDuration: withPalettes.loadingDotsDuration,
    loadingDotsEaseUp: withPalettes.loadingDotsEaseUp,
    loadingDotsEaseDown: withPalettes.loadingDotsEaseDown,
    enableHoverLift: withPalettes.enableHoverLift,
    enablePressSqueeze: withPalettes.enablePressSqueeze,
    enableToggleButtonFill: withPalettes.enableToggleButtonFill,
    enableRipple: withPalettes.enableRipple,
    enableExpandable: withPalettes.enableExpandable,
    enableToastStack: withPalettes.enableToastStack,
    enableAsyncButtonCrossfade: withPalettes.enableAsyncButtonCrossfade,
    enableContentFade: withPalettes.enableContentFade,
    enableFeedbackExpand: withPalettes.enableFeedbackExpand,
    enableProgressFill: withPalettes.enableProgressFill,
    enableLoadingDots: withPalettes.enableLoadingDots,
  };

  const tokens: ThemeTokenOverrides = {
    space: withPalettes.space,
    size: withPalettes.size,
    radius: withPalettes.radius,
    borderWidth: withPalettes.borderWidth,
    focusRingWidth: withPalettes.focusRingWidth,
    focusRingOffset: withPalettes.focusRingOffset,
    textScale: withPalettes.textScale,
    fontFamily: withPalettes.fontFamily,
    fontFamilyMono: withPalettes.fontFamilyMono,
    fontWeights: { ...withPalettes.fontWeights },
    shadowStrength: withPalettes.shadowStrength,
    shadowSize: withPalettes.shadowSize,
    toastScrimSize: withPalettes.toastScrimSize,
    toastScrimDensity: withPalettes.toastScrimDensity,
  };

  return {
    theme: withPalettes.theme,
    tokens,
    colors: {
      dark: { ...withPalettes.modePalettes.dark },
      light: { ...withPalettes.modePalettes.light },
    },
    motion,
    toast: true,
  };
}

function resolveCustomTokenValue(
  definition: CustomThemeTokenValue | CustomThemeTokenDefinition,
  mode: ThemeMode,
): { value: CustomThemeTokenValue; unit?: string } | null {
  if (
    typeof definition === "string" ||
    typeof definition === "number" ||
    typeof definition === "boolean"
  ) {
    return { value: definition };
  }

  const value = definition.values?.[mode] ?? definition.value;
  return value === undefined ? null : { value, unit: definition.unit };
}

/** Resolve custom token definitions to CSS-ready values for the active mode. */
export function resolveCustomThemeTokens(
  customTokens: CustomThemeTokens | undefined,
  mode: ThemeMode,
): Record<`--${string}`, string> {
  const resolved = {} as Record<`--${string}`, string>;
  if (!customTokens) return resolved;

  for (const [name, definition] of Object.entries(customTokens) as [
    `--${string}`,
    CustomThemeTokenValue | CustomThemeTokenDefinition,
  ][]) {
    const token = resolveCustomTokenValue(definition, mode);
    if (!token) continue;
    resolved[name] =
      typeof token.value === "number" && token.unit
        ? `${token.value}${token.unit}`
        : String(token.value);
  }

  return resolved;
}

type PreviousCustomToken = { priority: string; value: string };
const appliedCustomTokens = new WeakMap<HTMLElement, Map<string, PreviousCustomToken>>();

/** Apply custom CSS variables and remove stale variables previously owned by Burne UI. */
export function applyCustomThemeTokens(
  customTokens: CustomThemeTokens | undefined,
  root: HTMLElement,
  mode: ThemeMode,
) {
  const resolved = resolveCustomThemeTokens(customTokens, mode);
  const nextNames = new Set(Object.keys(resolved));
  const previousTokens = appliedCustomTokens.get(root) ?? new Map<string, PreviousCustomToken>();

  previousTokens.forEach((previous, name) => {
    if (nextNames.has(name)) return;
    if (previous.value) {
      root.style.setProperty(name, previous.value, previous.priority);
    } else {
      root.style.removeProperty(name);
    }
    previousTokens.delete(name);
  });
  for (const [name, value] of Object.entries(resolved)) {
    if (!previousTokens.has(name)) {
      previousTokens.set(name, {
        value: root.style.getPropertyValue(name),
        priority: root.style.getPropertyPriority(name),
      });
    }
    root.style.setProperty(name, value);
  }

  appliedCustomTokens.set(root, previousTokens);
}

/** Remove all custom variables last applied by Burne UI on this root. */
export function clearCustomThemeTokens(root?: HTMLElement) {
  if (typeof document === "undefined") return;
  const target = root ?? document.documentElement;
  appliedCustomTokens.get(target)?.forEach((previous, name) => {
    if (previous.value) {
      target.style.setProperty(name, previous.value, previous.priority);
    } else {
      target.style.removeProperty(name);
    }
  });
  appliedCustomTokens.delete(target);
}

/**
 * Default app theme snapshot (shared tokens + light/dark colors + motion).
 * Used by scaffolds / `burne-ui init` and as a starting point for Copy config edits.
 */
export function createDefaultBurneThemeConfig(options?: {
  theme?: ThemeMode;
  storageKey?: string | null;
}): BurneThemeConfig {
  const config = themeTokenStateToConfig(createDefaultThemeState(options?.theme ?? "dark"));
  return {
    ...config,
    storageKey: options?.storageKey === undefined ? DEFAULT_THEME_STORAGE_KEY : options.storageKey,
  };
}

/** TypeScript source for a starter `burne-theme.ts` (same shape as playground Copy config). */
export function exportDefaultBurneThemeConfigSource(options?: { exportName?: string }): string {
  const exportName = options?.exportName ?? "burneTheme";
  const body = stringifyValue(createDefaultBurneThemeConfig(), 0);

  return [
    "/**",
    " * Burne UI theme config (starter snapshot).",
    " *",
    " * - Edit `tokens` / `motion` (shared), `colors.light` / `colors.dark`,",
    " *   and optional `customTokens` for project-specific CSS variables.",
    " * - Or replace this file with docs site → Copy config.",
    " *",
    " *   import { BurneUIProvider } from \"burne-ui\";",
    ` *   import ${exportName} from \"./burne-theme\";`,
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

/** Merge shared token overrides into a full `ThemeTokenState` (no mode colors). */
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
      focusRingWidth: overrides.focusRingWidth,
      focusRingOffset: overrides.focusRingOffset,
      textScale: overrides.textScale,
      fontFamily: overrides.fontFamily,
      fontFamilyMono: overrides.fontFamilyMono,
      shadowStrength: overrides.shadowStrength,
      shadowSize: overrides.shadowSize,
      toastScrimSize: overrides.toastScrimSize,
      toastScrimDensity: overrides.toastScrimDensity,
    }),
    fontWeights: overrides.fontWeights
      ? { ...base.fontWeights, ...overrides.fontWeights }
      : base.fontWeights,
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
 * Apply a `BurneThemeConfig` to the document.
 * Colors for the resolved mode come from `colors[mode]`.
 * No-op during SSR (no `document`).
 */
export function applyBurneThemeConfig(
  config: BurneThemeConfig,
  root?: HTMLElement,
  resolvedTheme: ThemeMode = resolveTheme(config.theme),
) {
  if (typeof document === "undefined") return;
  const target = root ?? document.documentElement;
  const state = resolveThemeTokenState(config, resolvedTheme);

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
    if (m.surfaceTransitionDuration !== undefined) {
      state.surfaceTransitionDuration = m.surfaceTransitionDuration;
    }
    if (m.toastDismissDuration !== undefined) state.toastDismissDuration = m.toastDismissDuration;
    if (m.toastDismissEase !== undefined) state.toastDismissEase = m.toastDismissEase;
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

  applyThemeTokens(state, target);
  applyCustomThemeTokens(config.customTokens, target, resolvedTheme);
}

export function resolveTheme(theme: BurneThemeMode | undefined = "system"): ThemeMode {
  if (theme === "light" || theme === "dark") return theme;
  if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: light)").matches) {
    return "light";
  }
  return "dark";
}

/** Alias: apply shared token overrides without mode colors. */
export function applyTokens(
  overrides: ThemeTokenOverrides,
  root?: HTMLElement,
  theme: ThemeMode = "dark",
) {
  applyBurneThemeConfig({ theme, tokens: overrides }, root, theme);
}

/** CSS string for `burne-theme-overrides.css` (same as playground “Copy CSS”). */
export function exportBurneThemeCss(config: BurneThemeConfig): string {
  const theme = resolveTheme(config.theme);
  const state = resolveThemeTokenState(config, theme);
  const css = exportThemeCss(state);
  const custom = resolveCustomThemeTokens(config.customTokens, theme);
  const entries = Object.entries(custom);
  if (entries.length === 0) return css;

  const customLines = entries.map(([name, value]) => `  ${name}: ${value};`).join("\n");
  return css.replace(/\n}(\n|$)/, `\n  /* Custom project tokens */\n${customLines}\n}$1`);
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
 * `tokens` / `motion` are shared; `colors.light` / `colors.dark` hold palettes.
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
    " * Save as `burne-theme.ts` and pass to BurneUIProvider:",
    " *",
    " *   import { BurneUIProvider } from \"burne-ui\";",
    ` *   import ${exportName} from \"./burne-theme\";`,
    " *",
    ` *   <BurneUIProvider config={${exportName}}>{children}</BurneUIProvider>`,
    " *",
    " * `tokens` / `motion` are shared; `colors.light` / `colors.dark` hold palettes.",
    " * Project-specific CSS variables and editor metadata live in `customTokens`.",
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
