import {
  applyMotionCssTokens,
  MOTION_CONFIG_DEFAULTS,
  type MotionConfig,
} from "@/components/core/utils/motionConfig";
import { FONT_WEIGHT_CSS_VAR, FONT_WEIGHT_DEFAULTS, type FontWeightStep } from "@/tokens/fontWeights";
import { TEXT_SCALE_BASES, type TextScaleStep } from "@/tokens/textScale";
import tokenPrimitives from "@/tokens/tokenPrimitives.json" with { type: "json" };
 
import { DARK_COLORS, LIGHT_COLORS } from "./themePalettes";
 
export type ThemeMode = "dark" | "light";
 
export { FONT_WEIGHT_DEFAULTS, FONT_WEIGHT_CSS_VAR };
 
export { DARK_COLORS, LIGHT_COLORS };
 
export { TEXT_SCALE_BASES };
 
export type ThemeStatusForegroundKey =
  | "dangerForeground"
  | "successForeground"
  | "infoForeground"
  | "warningForeground";
 
export type ThemeDerivedColorKey =
  | "primaryHover"
  | "defaultHover"
  | "transparentHover"
  | "secondaryHover"
  | "tertiaryHover"
  | "surfaceTintDanger"
  | "surfaceTintDangerHover"
  | "dangerFillHover"
  | "surfaceTintSuccess"
  | "surfaceTintSuccessHover"
  | "successFillHover"
  | "surfaceTintInfo"
  | "surfaceTintInfoHover"
  | "infoFillHover"
  | "surfaceTintWarning"
  | "surfaceTintWarningHover"
  | "warningFillHover"
  | "convergeRipplePrimaryFill"
  | "convergeRippleNeutral"
  | "convergeRippleNeutralMuted"
  | "convergeRippleDanger"
  | "convergeRippleSuccess"
  | "convergeRippleInfo"
  | "convergeRippleWarning";
 
export type ThemeColorKey =
  | "background"
  | "surface"
  | "secondary"
  | "secondaryForeground"
  | "tertiary"
  | "tertiaryForeground"
  | "border"
  | "shadow"
  | "shadowSecondary"
  | "foreground"
  | "muted"
  | "mutedForeground"
  | "primary"
  | "primaryForeground"
  | "primaryTint"
  | "primaryTintStrong"
  | "focusRing"
  | "focusRingDanger"
  | "focusRingSuccess"
  | "focusRingInfo"
  | "focusRingWarning"
  | "indicator"
  | "indicatorForeground"
  | "danger"
  | "success"
  | "info"
  | "warning"
  | ThemeStatusForegroundKey
  | ThemeDerivedColorKey;
 
export type ThemeFontWeightKey = FontWeightStep;
export type ThemeFontWeights = Record<ThemeFontWeightKey, number>;
 
export type ThemeColors = Record<ThemeColorKey, string>;
export type ThemeStatusForegrounds = Record<ThemeStatusForegroundKey, string>;
 
export type ThemeTokenState = {
  theme: ThemeMode;
  space: number;
  size: number;
  radius: number;
  borderWidth: number;
  /** Keyboard focus ring outline width (`--focus-ring-width`), px. */
  focusRingWidth: number;
  /** Keyboard focus ring outline offset (`--focus-ring-offset`), px. */
  focusRingOffset: number;
  textScale: number;
  /** Global letter-spacing in em (`--letter-spacing`). @default 0 */
  letterSpacing: number;
  fontFamily: string;
  fontFamilyMono: string;
  fontWeights: ThemeFontWeights;
  /** Opacity multiplier for `--shadow-small|base|mid|large` (`--shadow-opacity`). */
  shadowOpacity: number;
  /** Blur multiplier (`--shadow-blur`). */
  shadowBlur: number;
  /** Spread multiplier (`--shadow-spread`). */
  shadowSpread: number;
  /** Horizontal shadow nudge in px (`--shadow-offset-x`). */
  shadowOffsetX: number;
  /** Vertical shadow nudge in px (`--shadow-offset-y`). */
  shadowOffsetY: number;
  /** Substrate size multiplier Toast (`--toast-scrim-size`). */
  toastScrimSize: number;
  /** Substrate Density Multiplier Toast (`--toast-scrim-density`). */
  toastScrimDensity: number;
  interactiveDuration: number;
  interactiveEase: string;
  hoverLiftEase: string;
  tooltipDuration: number;
  modalDuration: number;
  switchThumbDuration: number;
  switchThumbEase: string;
  selectionFillDuration: number;
  selectionFillEase: string;
  hoverLiftScale: number;
  badgeAnchorHoverLiftScale: number;
  /** Middle keyframe of `pressSqueezeScale` ([1, mid, 1]). */
  pressSqueezeMid: number;
  /**
   * Multiplier on `interactiveDuration` for press-squeeze total
   * (and open-after-squeeze delay). @default 1.15
   */
  pressSqueezeDurationFactor: number;
  rippleDefaultDuration: number;
  rippleDefaultOpacityFrom: number;
  rippleExpandableDuration: number;
  rippleExpandableOpacityFrom: number;
  rippleEaseCss: string;
  expandDuration: number;
  expandOpenEase: string;
  progressFillDuration: number;
  progressFillEase: string;
  progressIndeterminateDuration: number;
  progressIndeterminateEase: string;
  loadingDotsDuration: number;
  loadingDotsEaseUp: string;
  loadingDotsEaseDown: string;
  /** CSS `--motion-surface-duration` (surface / text / shadow transitions), ms. */
  surfaceTransitionDuration: number;
  /** Toast dismiss + last-scrim out, ms. */
  toastDismissDuration: number;
  toastDismissEase: string;
  enableAnimations: boolean;
  enableHoverLift: boolean;
  enablePressSqueeze: boolean;
  enableToggleButtonFill: boolean;
  enableRipple: boolean;
  enableExpandable: boolean;
  enableToastStack: boolean;
  enableContentFade: boolean;
  enableProgressFill: boolean;
  enableLoadingDots: boolean;
  enableModalMotion: boolean;
  enableSwitchThumb: boolean;
  enableTabsIndicator: boolean;
  enablePaginationFlip: boolean;
  enableSelectionFill: boolean;
  colors: ThemeColors;
  /** Light/dark palettes — shared tokens stay on the root state; mode switch reads from here. */
  modePalettes: Record<ThemeMode, ThemeColors>;
};
 
export const COLOR_CSS_VAR: Record<ThemeColorKey, string> = {
  background: "--color-background",
  surface: "--color-surface",
  secondary: "--color-secondary",
  secondaryForeground: "--color-secondary-foreground",
  tertiary: "--color-tertiary",
  tertiaryForeground: "--color-tertiary-foreground",
  border: "--color-border",
  shadow: "--color-shadow",
  shadowSecondary: "--color-shadow-secondary",
  foreground: "--color-foreground",
  muted: "--color-muted",
  mutedForeground: "--color-muted-foreground",
  primary: "--color-primary",
  primaryForeground: "--color-primary-foreground",
  primaryTint: "--color-primary-tint",
  primaryTintStrong: "--color-primary-tint-strong",
  focusRing: "--color-focus-ring",
  focusRingDanger: "--color-focus-ring-danger",
  focusRingSuccess: "--color-focus-ring-success",
  focusRingInfo: "--color-focus-ring-info",
  focusRingWarning: "--color-focus-ring-warning",
  indicator: "--color-indicator",
  indicatorForeground: "--color-indicator-foreground",
  danger: "--color-danger",
  success: "--color-success",
  info: "--color-info",
  warning: "--color-warning",
  dangerForeground: "--color-danger-foreground",
  successForeground: "--color-success-foreground",
  infoForeground: "--color-info-foreground",
  warningForeground: "--color-warning-foreground",
  primaryHover: "--color-primary-hover",
  defaultHover: "--color-default-hover",
  transparentHover: "--color-transparent-hover",
  secondaryHover: "--color-secondary-hover",
  tertiaryHover: "--color-tertiary-hover",
  surfaceTintDanger: "--color-surface-tint-danger",
  surfaceTintDangerHover: "--color-surface-tint-danger-hover",
  dangerFillHover: "--color-danger-fill-hover",
  surfaceTintSuccess: "--color-surface-tint-success",
  surfaceTintSuccessHover: "--color-surface-tint-success-hover",
  successFillHover: "--color-success-fill-hover",
  surfaceTintInfo: "--color-surface-tint-info",
  surfaceTintInfoHover: "--color-surface-tint-info-hover",
  infoFillHover: "--color-info-fill-hover",
  surfaceTintWarning: "--color-surface-tint-warning",
  surfaceTintWarningHover: "--color-surface-tint-warning-hover",
  warningFillHover: "--color-warning-fill-hover",
  convergeRipplePrimaryFill: "--color-converge-ripple-primary-fill",
  convergeRippleNeutral: "--color-converge-ripple-neutral",
  convergeRippleNeutralMuted: "--color-converge-ripple-neutral-muted",
  convergeRippleDanger: "--color-converge-ripple-danger",
  convergeRippleSuccess: "--color-converge-ripple-success",
  convergeRippleInfo: "--color-converge-ripple-info",
  convergeRippleWarning: "--color-converge-ripple-warning",
};
 
 
export const SCALE_DEFAULTS = {
  space: 0.5,
  size: 1,
  radius: 0.5,
  borderWidth: 1,
  focusRingWidth: 2,
  focusRingOffset: 0,
  textScale: 1,
  letterSpacing: 0,
  shadowOpacity: 1,
  shadowBlur: 1,
  shadowSpread: 1,
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  toastScrimSize: 1,
  toastScrimDensity: 1,
} as const;
 
export const MOTION_DEFAULTS = (() => {
  const { pressSqueezeScale, ...rest } = MOTION_CONFIG_DEFAULTS;
  return {
    ...rest,
    pressSqueezeMid: pressSqueezeScale[1],
  };
})();
 
export const DEFAULT_FONT = tokenPrimitives.fontFamilySans;
 
export const DEFAULT_FONT_MONO = tokenPrimitives.fontFamilyMono;
 
type TextScaleToken = TextScaleStep;
 
/**
 * Fluid curve for `--space` / `--size` / `--radius` in `tokens/styles.css`:
 * ~93.75% at narrow viewports → 100% from ~800px (preferred mixes rem + vw).
 * Scale the whole clamp by the knob max (desktop) rem so overrides stay responsive.
 */
const FLUID_MIN_RATIO = 0.9375;
const FLUID_PREFERRED_REM_RATIO = 0.875;
const FLUID_PREFERRED_VW_RATIO = 0.25;
 
function formatCssNumber(n: number): string {
  const rounded = Math.round(n * 1e8) / 1e8;
  return String(rounded);
}
 
/** CSS value for a fluid scale knob — matches default tokens when `maxRem` is the CSS max. */
export function fluidScaleRem(maxRem: number): string {
  if (maxRem === 0) return "0rem";
  const min = formatCssNumber(maxRem * FLUID_MIN_RATIO);
  const preferredRem = formatCssNumber(maxRem * FLUID_PREFERRED_REM_RATIO);
  const preferredVw = formatCssNumber(maxRem * FLUID_PREFERRED_VW_RATIO);
  const max = formatCssNumber(maxRem);
  return `clamp(${min}rem, ${preferredRem}rem + ${preferredVw}vw, ${max}rem)`;
}

/** Fixed rem, the same unit the kit stylesheet uses for `--space` / `--size` / `--radius`. */
function fixedRem(value: number): string {
  if (value === 0) return "0rem";
  return `${formatCssNumber(value)}rem`;
}
 
/**
 * Write shadow knobs as CSS vars; geometry stays in stylesheet `calc(…)`.
 * Interactive GSAP reads the used `box-shadow` from this cascade (probe) —
 * do not duplicate opacity/geom formulas in TS motion code.
 */
function applyShadowKnobs(
  root: HTMLElement,
  state: ThemeTokenState,
  defaults: ThemeTokenState,
) {
  setOrClearInline(
    root,
    "--shadow-opacity",
    state.shadowOpacity !== defaults.shadowOpacity ? String(state.shadowOpacity) : null,
  );
  setOrClearInline(
    root,
    "--shadow-blur",
    state.shadowBlur !== defaults.shadowBlur ? String(state.shadowBlur) : null,
  );
  setOrClearInline(
    root,
    "--shadow-spread",
    state.shadowSpread !== defaults.shadowSpread ? String(state.shadowSpread) : null,
  );
  setOrClearInline(
    root,
    "--shadow-offset-x",
    state.shadowOffsetX !== defaults.shadowOffsetX ? `${state.shadowOffsetX}px` : null,
  );
  setOrClearInline(
    root,
    "--shadow-offset-y",
    state.shadowOffsetY !== defaults.shadowOffsetY ? `${state.shadowOffsetY}px` : null,
  );
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
 
function clearTextScale(root: HTMLElement) {
  for (const key of Object.keys(TEXT_SCALE_BASES) as TextScaleToken[]) {
    root.style.removeProperty(`--text-scale-${key}`);
    root.style.removeProperty(`--text-scale-${key}--line-height`);
  }
}
 
function applyFontWeights(root: HTMLElement, fontWeights: ThemeFontWeights, defaults: ThemeFontWeights) {
  for (const [key, cssVar] of Object.entries(FONT_WEIGHT_CSS_VAR) as [ThemeFontWeightKey, string][]) {
    setOrClearInline(root, cssVar, fontWeights[key] !== defaults[key] ? String(fontWeights[key]) : null);
  }
}
 
/** Set inline custom property, or remove it so stylesheet / user CSS can win. */
function setOrClearInline(root: HTMLElement, name: string, value: string | null) {
  if (value === null) root.style.removeProperty(name);
  else root.style.setProperty(name, value);
}
 
function borderWidthCss(px: number): string {
  return px === 0 ? "0px" : `${px}px`;
}
 
/** Outline surfaces keep at least a hairline when the theme knob is 0. */
export const OUTLINE_BORDER_WIDTH_MIN_PX = 0.5;
 
export type ResolvedBorderTokenCss = {
  /** `--border-width` — layout width for non-outline borders. */
  borderWidth: string;
  /** `--border-width-outline` — always ≥ {@link OUTLINE_BORDER_WIDTH_MIN_PX}. */
  borderWidthOutline: string;
  /**
   * `--border-color` override. When the knob is 0, non-outline borders stay
   * hairline-wide but transparent so control heights stay aligned with outline.
   */
  borderColor: string | null;
};
 
/** Map the single `borderWidth` theme knob onto the two CSS border tokens. */
export function resolveBorderTokenCss(borderWidth: number): ResolvedBorderTokenCss {
  const outlinePx = Math.max(borderWidth, OUTLINE_BORDER_WIDTH_MIN_PX);
  if (borderWidth <= 0) {
    return {
      borderWidth: borderWidthCss(outlinePx),
      borderWidthOutline: borderWidthCss(outlinePx),
      borderColor: "transparent",
    };
  }
  return {
    borderWidth: borderWidthCss(borderWidth),
    borderWidthOutline: borderWidthCss(outlinePx),
    borderColor: null,
  };
}
 
function applyBorderTokenCss(target: HTMLElement, borderWidth: number, defaultBorderWidth: number) {
  if (borderWidth === defaultBorderWidth) {
    setOrClearInline(target, "--border-width", null);
    setOrClearInline(target, "--border-width-outline", null);
    setOrClearInline(target, "--border-color", null);
    return;
  }
  const resolved = resolveBorderTokenCss(borderWidth);
  setOrClearInline(target, "--border-width", resolved.borderWidth);
  setOrClearInline(target, "--border-width-outline", resolved.borderWidthOutline);
  setOrClearInline(target, "--border-color", resolved.borderColor);
}
 
function createDefaultModePalettes(): Record<ThemeMode, ThemeColors> {
  return {
    dark: { ...DARK_COLORS },
    light: { ...LIGHT_COLORS },
  };
}
 
/** Ensure `modePalettes` exists and every palette has the full color key set. */
export function ensureModePalettes(state: ThemeTokenState): ThemeTokenState {
  const defaults = createDefaultModePalettes();
  if (!state.modePalettes?.dark || !state.modePalettes?.light) {
    const current: ThemeColors = { ...defaults[state.theme], ...state.colors };
    return {
      ...state,
      colors: current,
      modePalettes: {
        dark: state.theme === "dark" ? current : { ...defaults.dark },
        light: state.theme === "light" ? current : { ...defaults.light },
      },
    };
  }
  const dark = { ...defaults.dark, ...state.modePalettes.dark };
  const light = { ...defaults.light, ...state.modePalettes.light };
  const colors = { ...(state.theme === "dark" ? dark : light), ...state.colors };
  return {
    ...state,
    colors: { ...defaults[state.theme], ...colors },
    modePalettes: { dark, light },
  };
}
 
/** Copy the active mode palette onto top-level `colors`. */
export function activateThemeModePalette(
  state: ThemeTokenState,
  theme: ThemeMode,
): ThemeTokenState {
  const withPalettes = ensureModePalettes(state);
  const palette = withPalettes.modePalettes[theme];
  return {
    ...withPalettes,
    theme,
    colors: { ...palette },
  };
}
 
/** Patch a color on the active mode and keep `modePalettes` in sync. */
export function patchThemeColor(
  state: ThemeTokenState,
  key: ThemeColorKey,
  value: string,
): ThemeTokenState {
  const withPalettes = ensureModePalettes(state);
  const colors = { ...withPalettes.colors, [key]: value };
  return {
    ...withPalettes,
    colors,
    modePalettes: {
      ...withPalettes.modePalettes,
      [withPalettes.theme]: colors,
    },
  };
}
 
 
export function createDefaultThemeState(theme: ThemeMode = "dark"): ThemeTokenState {
  const modePalettes = createDefaultModePalettes();
  const active = modePalettes[theme];
  return {
    theme,
    ...SCALE_DEFAULTS,
    ...MOTION_DEFAULTS,
    fontFamily: DEFAULT_FONT,
    fontFamilyMono: DEFAULT_FONT_MONO,
    fontWeights: { ...FONT_WEIGHT_DEFAULTS },
    colors: { ...active },
    modePalettes,
  };
}
 
 
const INLINE_TOKEN_VARS = [
  "--space",
  "--size",
  "--radius",
  "--border-width",
  "--border-width-outline",
  "--border-color",
  "--focus-ring-width",
  "--focus-ring-offset",
  "--motion-surface-duration",
  "--font-family-sans",
  "--font-family-mono",
  "--letter-spacing",
  ...Object.values(FONT_WEIGHT_CSS_VAR),
  "--shadow-opacity",
  "--shadow-blur",
  "--shadow-spread",
  "--shadow-offset-x",
  "--shadow-offset-y",
  "--toast-scrim-size",
  "--toast-scrim-density",
  ...Object.keys(TEXT_SCALE_BASES).flatMap((key) => [
    `--text-scale-${key}`,
    `--text-scale-${key}--line-height`,
  ]),
  ...Object.values(COLOR_CSS_VAR),
] as const;
 
export function clearThemeInlineTokens(root?: HTMLElement) {
  if (typeof document === "undefined") return;
  const target = root ?? document.documentElement;
  for (const name of INLINE_TOKEN_VARS) {
    target.style.removeProperty(name as string);
  }
  delete target.dataset.theme;
}
 
const lastCssDurationByRoot = new WeakMap<HTMLElement, number>();
 
/**
 * GSAP overlay from a theme-token snapshot (playground / site editor).
 * `applyThemeTokens` no longer calls `configureMotion` — CSS tokens stay
 * per-root; a single editor root should call `configureMotion(this)`.
 */
export function motionConfigFromThemeState(state: ThemeTokenState): Partial<MotionConfig> {
  return {
    interactiveDuration: state.interactiveDuration,
    interactiveEase: state.interactiveEase,
    hoverLiftEase: state.hoverLiftEase,
    tooltipDuration: state.tooltipDuration,
    modalDuration: state.modalDuration,
    switchThumbDuration: state.switchThumbDuration,
    switchThumbEase: state.switchThumbEase,
    selectionFillDuration: state.selectionFillDuration,
    selectionFillEase: state.selectionFillEase,
    hoverLiftScale: state.hoverLiftScale,
    badgeAnchorHoverLiftScale: state.badgeAnchorHoverLiftScale,
    pressSqueezeScale: [1, state.pressSqueezeMid, 1],
    pressSqueezeDurationFactor: state.pressSqueezeDurationFactor,
    rippleDefaultDuration: state.rippleDefaultDuration,
    rippleDefaultOpacityFrom: state.rippleDefaultOpacityFrom,
    rippleExpandableDuration: state.rippleExpandableDuration,
    rippleExpandableOpacityFrom: state.rippleExpandableOpacityFrom,
    rippleEaseCss: state.rippleEaseCss,
    expandDuration: state.expandDuration,
    expandOpenEase: state.expandOpenEase,
    surfaceTransitionDuration: state.surfaceTransitionDuration,
    toastDismissDuration: state.toastDismissDuration,
    toastDismissEase: state.toastDismissEase,
    progressFillDuration: state.progressFillDuration,
    progressFillEase: state.progressFillEase,
    progressIndeterminateDuration: state.progressIndeterminateDuration,
    progressIndeterminateEase: state.progressIndeterminateEase,
    loadingDotsDuration: state.loadingDotsDuration,
    loadingDotsEaseUp: state.loadingDotsEaseUp,
    loadingDotsEaseDown: state.loadingDotsEaseDown,
    enableAnimations: state.enableAnimations,
    enableHoverLift: state.enableHoverLift,
    enablePressSqueeze: state.enablePressSqueeze,
    enableToggleButtonFill: state.enableToggleButtonFill,
    enableRipple: state.enableRipple,
    enableExpandable: state.enableExpandable,
    enableToastStack: state.enableToastStack,
    enableContentFade: state.enableContentFade,
    enableProgressFill: state.enableProgressFill,
    enableLoadingDots: state.enableLoadingDots,
    enableModalMotion: state.enableModalMotion,
    enableSwitchThumb: state.enableSwitchThumb,
    enableTabsIndicator: state.enableTabsIndicator,
    enablePaginationFlip: state.enablePaginationFlip,
    enableSelectionFill: state.enableSelectionFill,
  };
}
 
function applyMotionFromState(state: ThemeTokenState, root: HTMLElement) {
  const ms = state.surfaceTransitionDuration;
  if (lastCssDurationByRoot.get(root) === ms) return;
  lastCssDurationByRoot.set(root, ms);
  applyMotionCssTokens(root, { surfaceTransitionDuration: ms });
}
 
/**
 * Apply theme tokens as inline CSS variables.
 * Only values that differ from kit defaults are written — matching values are
 * cleared so `burne-ui/styles.css` and user override sheets can still win
 * (inline styles otherwise block all stylesheet redefinitions).
 */
export function applyThemeTokens(state: ThemeTokenState, root?: HTMLElement) {
  if (typeof document === "undefined") return;
  const target = root ?? document.documentElement;
  const defaults = createDefaultThemeState(state.theme);
 
  if (state.theme === "light") {
    target.dataset.theme = "light";
  } else {
    delete target.dataset.theme;
  }
 
  setOrClearInline(
    target,
    "--space",
    state.space !== defaults.space ? fixedRem(state.space) : null,
  );
  setOrClearInline(
    target,
    "--size",
    state.size !== defaults.size ? fixedRem(state.size) : null,
  );
  setOrClearInline(
    target,
    "--radius",
    state.radius !== defaults.radius ? fixedRem(state.radius) : null,
  );
  applyBorderTokenCss(target, state.borderWidth, defaults.borderWidth);
  setOrClearInline(
    target,
    "--focus-ring-width",
    state.focusRingWidth !== defaults.focusRingWidth
      ? borderWidthCss(state.focusRingWidth)
      : null,
  );
  setOrClearInline(
    target,
    "--focus-ring-offset",
    state.focusRingOffset !== defaults.focusRingOffset
      ? `${state.focusRingOffset}px`
      : null,
  );
  setOrClearInline(
    target,
    "--font-family-sans",
    state.fontFamily !== defaults.fontFamily ? state.fontFamily : null,
  );
  setOrClearInline(
    target,
    "--font-family-mono",
    state.fontFamilyMono !== defaults.fontFamilyMono ? state.fontFamilyMono : null,
  );
  setOrClearInline(
    target,
    "--letter-spacing",
    state.letterSpacing !== defaults.letterSpacing ? `${state.letterSpacing}em` : null,
  );
  applyFontWeights(target, state.fontWeights, defaults.fontWeights);
 
  applyMotionFromState(state, target);
 
  if (state.textScale !== defaults.textScale) {
    applyTextScale(target, state.textScale);
  } else {
    clearTextScale(target);
  }
 
  applyShadowKnobs(target, state, defaults);
 
  setOrClearInline(
    target,
    "--toast-scrim-size",
    state.toastScrimSize !== defaults.toastScrimSize ? String(state.toastScrimSize) : null,
  );
  setOrClearInline(
    target,
    "--toast-scrim-density",
    state.toastScrimDensity !== defaults.toastScrimDensity
      ? String(state.toastScrimDensity)
      : null,
  );
 
  for (const [key, cssVar] of Object.entries(COLOR_CSS_VAR) as [ThemeColorKey, string][]) {
    setOrClearInline(
      target,
      cssVar,
      state.colors[key] !== defaults.colors[key] ? state.colors[key] : null,
    );
  }
}
 
/** CSS snapshot of tokens that differ from kit defaults (for override stylesheets). */
export function exportThemeCss(state: ThemeTokenState): string {
  const full = ensureModePalettes(state);
  const defaults = createDefaultThemeState("dark");
  const lightDefaults = createDefaultThemeState("light");
  const darkColors = full.theme === "dark" ? full.colors : full.modePalettes.dark;
  const lightColors = full.theme === "light" ? full.colors : full.modePalettes.light;
  const lines: string[] = [":root {"];
 
  if (full.space !== defaults.space) {
    lines.push(`  --space: ${fixedRem(full.space)};`);
  }
  if (full.size !== defaults.size) {
    lines.push(`  --size: ${fixedRem(full.size)};`);
  }
  if (full.radius !== defaults.radius) {
    lines.push(`  --radius: ${fixedRem(full.radius)};`);
  }
  if (full.borderWidth !== defaults.borderWidth) {
    const border = resolveBorderTokenCss(full.borderWidth);
    lines.push(`  --border-width: ${border.borderWidth};`);
    lines.push(`  --border-width-outline: ${border.borderWidthOutline};`);
    if (border.borderColor != null) {
      lines.push(`  --border-color: ${border.borderColor};`);
    }
  }
  if (full.focusRingWidth !== defaults.focusRingWidth) {
    lines.push(`  --focus-ring-width: ${borderWidthCss(full.focusRingWidth)};`);
  }
  if (full.focusRingOffset !== defaults.focusRingOffset) {
    lines.push(`  --focus-ring-offset: ${full.focusRingOffset}px;`);
  }
  if (full.fontFamily !== defaults.fontFamily) {
    lines.push(`  --font-family-sans: ${full.fontFamily};`);
  }
  if (full.fontFamilyMono !== defaults.fontFamilyMono) {
    lines.push(`  --font-family-mono: ${full.fontFamilyMono};`);
  }
  if (full.letterSpacing !== defaults.letterSpacing) {
    lines.push(`  --letter-spacing: ${full.letterSpacing}em;`);
  }
  for (const [key, cssVar] of Object.entries(FONT_WEIGHT_CSS_VAR) as [
    ThemeFontWeightKey,
    string,
  ][]) {
    if (full.fontWeights[key] !== defaults.fontWeights[key]) {
      lines.push(`  ${cssVar}: ${full.fontWeights[key]};`);
    }
  }
 
  if (full.shadowOpacity !== defaults.shadowOpacity) {
    lines.push(`  --shadow-opacity: ${full.shadowOpacity};`);
  }
  if (full.shadowBlur !== defaults.shadowBlur) {
    lines.push(`  --shadow-blur: ${full.shadowBlur};`);
  }
  if (full.shadowSpread !== defaults.shadowSpread) {
    lines.push(`  --shadow-spread: ${full.shadowSpread};`);
  }
  if (full.shadowOffsetX !== defaults.shadowOffsetX) {
    lines.push(`  --shadow-offset-x: ${full.shadowOffsetX}px;`);
  }
  if (full.shadowOffsetY !== defaults.shadowOffsetY) {
    lines.push(`  --shadow-offset-y: ${full.shadowOffsetY}px;`);
  }
 
  if (full.toastScrimSize !== defaults.toastScrimSize) {
    lines.push(`  --toast-scrim-size: ${full.toastScrimSize};`);
  }
  if (full.toastScrimDensity !== defaults.toastScrimDensity) {
    lines.push(`  --toast-scrim-density: ${full.toastScrimDensity};`);
  }
 
  if (full.surfaceTransitionDuration !== defaults.surfaceTransitionDuration) {
    lines.push(`  --motion-surface-duration: ${full.surfaceTransitionDuration}ms;`);
  }
 
  if (full.textScale !== defaults.textScale) {
    for (const key of Object.keys(TEXT_SCALE_BASES) as TextScaleToken[]) {
      const { size, line } = TEXT_SCALE_BASES[key];
      const scaledSize = size * full.textScale;
      const scaledLine = line * full.textScale;
      lines.push(`  --text-scale-${key}: ${scaledSize}rem;`);
      lines.push(
        `  --text-scale-${key}--line-height: calc(${scaledLine}rem / ${scaledSize}rem);`,
      );
    }
  }
 
  if (lines.length === 1) {
    lines.push("  /* (no overrides vs kit defaults) */");
  }
 
  lines.push("}");

  const blocks = [lines.join("\n")];

  const lightDecls: string[] = [];
  const darkDecls: string[] = [];
  for (const [key, cssVar] of Object.entries(COLOR_CSS_VAR) as [ThemeColorKey, string][]) {
    if (lightColors[key] !== lightDefaults.colors[key]) {
      lightDecls.push(`  ${cssVar}: ${lightColors[key]};`);
    }
    if (darkColors[key] !== defaults.colors[key]) {
      darkDecls.push(`  ${cssVar}: ${darkColors[key]};`);
    }
  }
  if (lightDecls.length > 0) {
    blocks.push(['[data-theme="light"] {', ...lightDecls, "}"].join("\n"));
  }
  // After the light block. `:root` alone would match `<html data-theme="light">`
  // at the same specificity and repaint the light page. `:not` misses that node;
  // `[data-theme="dark"]` still paints an island inside it.
  if (darkDecls.length > 0) {
    blocks.push(
      [':root:not([data-theme="light"]),', '[data-theme="dark"] {', ...darkDecls, "}"].join("\n"),
    );
  }
 
  return blocks.join("\n\n");
}
 