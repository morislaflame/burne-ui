import { configureMotion } from "@/components/core/utils/motionConfig";
import {
  FONT_WEIGHT_CSS_VAR,
  FONT_WEIGHT_DEFAULTS,
  type FontWeightStep,
} from "@/tokens/fontWeights";

import {
  BORDER_COLOR_CSS_FORMULA,
  DARK_COLORS,
  LIGHT_COLORS,
  DARK_STATUS_FOREGROUNDS,
  LIGHT_STATUS_FOREGROUNDS,
} from "./themePalettes";

export type ThemeMode = "dark" | "light";

export { FONT_WEIGHT_DEFAULTS, FONT_WEIGHT_CSS_VAR };

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

/** Color preset keys — each preset has dark and light palette slices. */
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
  | "mystic";

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
  interactiveEase: string;
  hoverLiftEase: string;
  tooltipDuration: number;
  switchThumbDuration: number;
  switchThumbEase: string;
  selectionFillDuration: number;
  selectionFillEase: string;
  hoverLiftScale: number;
  badgeAnchorHoverLiftScale: number;
  /** Middle keyframe of `pressSqueezeScale` ([1, mid, 1]). */
  pressSqueezeMid: number;
  rippleDefaultDuration: number;
  rippleDefaultOpacityFrom: number;
  rippleExpandableDuration: number;
  rippleExpandableOpacityFrom: number;
  rippleEaseCss: string;
  feedbackExpandDuration: number;
  expandDuration: number;
  expandOpenEase: string;
  progressFillDuration: number;
  progressFillEase: string;
  loadingDotsDuration: number;
  loadingDotsEaseUp: string;
  loadingDotsEaseDown: string;
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

export const SCALE_TOKEN_LABELS = {
  space: "Spacing",
  size: "Control size",
  radius: "Radius",
  borderWidth: "Border width",
  textScale: "Type scale",
  shadowStrength: "Shadow intensity",
  shadowSize: "Shadow blur scale",
  toastScrimSize: "Toast scrim size",
  toastScrimDensity: "Toast scrim density",
} as const;

export const MOTION_DURATION_LABELS = {
  interactiveDuration: "Interactive duration",
  tooltipDuration: "Tooltip duration",
  switchThumbDuration: "Switch thumb duration",
  selectionFillDuration: "Selection fill duration",
  expandDuration: "Expand duration",
  feedbackExpandDuration: "Feedback ring duration",
  rippleDefaultDuration: "Ripple duration",
  rippleExpandableDuration: "Expandable ripple duration",
  progressFillDuration: "Progress fill duration",
  loadingDotsDuration: "Loading dots duration",
} as const;

export const MOTION_SCALE_LABELS = {
  hoverLiftScale: "Hover lift scale",
  badgeAnchorHoverLiftScale: "Badge anchor lift scale",
  pressSqueezeMid: "Press squeeze depth",
  rippleDefaultOpacityFrom: "Ripple opacity",
  rippleExpandableOpacityFrom: "Expandable ripple opacity",
} as const;

export const MOTION_EASE_LABELS = {
  interactiveEase: "Interactive easing",
  hoverLiftEase: "Hover lift easing",
  switchThumbEase: "Switch thumb easing",
  selectionFillEase: "Selection fill easing",
  expandOpenEase: "Expand open easing",
  progressFillEase: "Progress fill easing",
  loadingDotsEaseUp: "Loading dots up",
  loadingDotsEaseDown: "Loading dots down",
} as const;

export const GSAP_EASE_OPTIONS = [
  "power1.out",
  "power2.out",
  "power3.out",
  "power1.inOut",
  "power2.inOut",
  "power3.inOut",
  "sine.inOut",
  "back.out(1.4)",
  "back.out(1.25)",
  "elastic.out(1, 0.5)",
] as const;

export const RIPPLE_EASE_CSS_OPTIONS = [
  "cubic-bezier(0.25, 0.55, 0.35, 0.95)",
  "cubic-bezier(0.22, 1, 0.36, 1)",
  "ease-out",
  "ease-in-out",
] as const;

export const ANIMATION_FLAG_LABELS = {
  enableHoverLift: "Hover lift",
  enablePressSqueeze: "Press squeeze",
  enableToggleButtonFill: "Toggle & calendar fill",
  enableRipple: "Press ripple",
  enableExpandable: "Expandable / accordion",
  enableToastStack: "Toast stack",
  enableAsyncButtonCrossfade: "Button async crossfade",
  enableContentFade: "Content fade",
  enableFeedbackExpand: "Button feedback ring",
  enableProgressFill: "Progress bar fill",
  enableLoadingDots: "Loading dots wave",
} as const;

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

export const FONT_WEIGHT_LABELS: Record<ThemeFontWeightKey, string> = {
  small: "Small",
  base: "Base",
  mid: "Mid",
  strong: "Strong",
  bold: "Bold",
};

export const COLOR_LABELS: Record<ThemeColorKey, string> = {
  background: "Background",
  surface: "Surface",
  secondary: "Secondary",
  secondaryForeground: "Secondary foreground",
  tertiary: "Tertiary",
  tertiaryForeground: "Tertiary foreground",
  border: "Border",
  foreground: "Foreground",
  muted: "Muted",
  primary: "Primary",
  primaryForeground: "Primary foreground",
  primaryTint: "Primary tint",
  primaryTintStrong: "Primary tint strong",
  focusRing: "Focus ring",
  indicator: "Indicator",
  indicatorForeground: "Indicator foreground",
  danger: "Danger",
  success: "Success",
  info: "Info",
  warning: "Warning",
};

export const STATUS_FOREGROUND_LABELS: Record<ThemeStatusForegroundKey, string> = {
  dangerForeground: "Danger foreground",
  successForeground: "Success foreground",
  infoForeground: "Info foreground",
  warningForeground: "Warning foreground",
};

/** Border formula for UI (dark and light — one line, as in tokens/styles.css). */
export const BORDER_COLOR_CSS_FORMULA_BY_THEME: Record<ThemeMode, string> = {
  dark: BORDER_COLOR_CSS_FORMULA,
  light: BORDER_COLOR_CSS_FORMULA,
};

export function isDefaultBorderColor(border: string): boolean {
  return border === BORDER_COLOR_CSS_FORMULA;
}

export function isBorderColorCustomized(colors: ThemeColors): boolean {
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
  interactiveEase: "power2.out",
  hoverLiftEase: "sine.inOut",
  tooltipDuration: 200,
  switchThumbDuration: 340,
  switchThumbEase: "back.out(1.4)",
  selectionFillDuration: 200,
  selectionFillEase: "back.out(1.25)",
  hoverLiftScale: 1.025,
  badgeAnchorHoverLiftScale: 1.052,
  pressSqueezeMid: 0.98,
  rippleDefaultDuration: 700,
  rippleDefaultOpacityFrom: 0.42,
  rippleExpandableDuration: 700,
  rippleExpandableOpacityFrom: 0.34,
  rippleEaseCss: "cubic-bezier(0.25, 0.55, 0.35, 0.95)",
  feedbackExpandDuration: 720,
  expandDuration: 200,
  expandOpenEase: "sine.inOut",
  progressFillDuration: 600,
  progressFillEase: "power2.out",
  loadingDotsDuration: 900,
  loadingDotsEaseUp: "power2.out",
  loadingDotsEaseDown: "power2.in",
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
    colorPreset: "default",
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
    root.style.removeProperty(name as string);
  }
  delete root.dataset.theme;
}

let lastMotionSnapshot = "";

function applyMotionFromState(state: ThemeTokenState) {
  const snapshot = JSON.stringify({
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
    pressSqueezeMid: state.pressSqueezeMid,
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
  });

  if (snapshot === lastMotionSnapshot) return;
  lastMotionSnapshot = snapshot;

  configureMotion({
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
  });
}

export function applyThemeTokens(state: ThemeTokenState, root: HTMLElement = document.documentElement) {
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

  applyMotionFromState(state);

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
