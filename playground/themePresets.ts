/**
 * Theme builder presets (colors / fonts / layout / motion / full themes).
 * Lives in playground — not in the burne-ui package runtime API.
 *
 * Theme presets MUST set the full non-color token surface (scale, fonts,
 * shadows/glass, motion durations/eases/scales, animation flags). Colors come
 * from `colorPreset` + `applyColorPresetToState`. Mode (light/dark) is kept.
 */
import type { ColorPresetKey } from "./colorPresets";
import { applyColorPresetToState } from "./colorPresets";
import {
  DEFAULT_FONT,
  DEFAULT_FONT_MONO,
  DARK_COLORS,
  FONT_WEIGHT_DEFAULTS,
  LIGHT_COLORS,
  MOTION_DEFAULTS,
  SCALE_DEFAULTS,
  type ThemeEditorState,
  type ThemeFontWeights,
  type ThemeTokenState,
} from "./themeDefaults";

export const LAYOUT_PRESETS = {
  compact: { space: 0.4, size: 0.9, radius: 0.375, borderWidth: 1, textScale: 0.95 },
  spacious: { space: 0.625, size: 1.125, radius: 0.625, borderWidth: 1, textScale: 1.05 },
  flat: { space: 0.5, size: 1, radius: 0.375, borderWidth: 0, textScale: 1 },
} as const;

export type LayoutPresetKey = keyof typeof LAYOUT_PRESETS;

/** Every editable theme knob except mode + color palettes. */
export type ThemePresetTokens = Omit<ThemeTokenState, "theme" | "colors" | "modePalettes">;

/** Authoring overrides — missing keys fall back to kit defaults on resolve. */
export type ThemePresetTokenOverrides = Partial<Omit<ThemePresetTokens, "fontWeights">> & {
  fontWeights?: Partial<ThemeFontWeights>;
};

export type ThemePresetDefinition = {
  label: string;
  /** Palette pair from color presets. */
  colorPreset: ColorPresetKey;
  /** Full token snapshot after resolve (never partial at apply time). */
  tokens: ThemePresetTokens;
};

/** Kit defaults for all non-color theme knobs. */
export const THEME_PRESET_TOKEN_DEFAULTS: ThemePresetTokens = {
  ...SCALE_DEFAULTS,
  ...MOTION_DEFAULTS,
  fontFamily: DEFAULT_FONT,
  fontFamilyMono: DEFAULT_FONT_MONO,
  fontWeights: { ...FONT_WEIGHT_DEFAULTS },
};

/** Merge overrides onto full defaults — apply always resets the whole surface. */
export function resolveThemePresetTokens(
  overrides: ThemePresetTokenOverrides = {},
): ThemePresetTokens {
  const { fontWeights, ...rest } = overrides;
  return {
    ...THEME_PRESET_TOKEN_DEFAULTS,
    ...rest,
    fontWeights: {
      ...THEME_PRESET_TOKEN_DEFAULTS.fontWeights,
      ...fontWeights,
    },
  };
}

export const THEME_PRESETS = {
  default: {
    label: "Default",
    colorPreset: "default",
    tokens: resolveThemePresetTokens(),
  },
  compact: {
    label: "Compact",
    colorPreset: "slate",
    tokens: resolveThemePresetTokens({
      ...LAYOUT_PRESETS.compact,
      letterSpacing: -0.01,
      shadowOpacity: 0.9,
      shadowBlur: 0.9,
      focusRingWidth: 1.5,
      toastScrimSize: 0.9,
      toastScrimDensity: 1.05,
      fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
      fontWeights: { small: 500, base: 500, mid: 600, strong: 700, bold: 800 },
      interactiveDuration: 220,
      tooltipDuration: 160,
      modalDuration: 240,
      expandDuration: 160,
      surfaceTransitionDuration: 420,
      toastDismissDuration: 180,
      hoverLiftScale: 1.015,
      badgeAnchorHoverLiftScale: 1.035,
      pressSqueezeMid: 0.97,
      pressSqueezeDurationFactor: 1.05,
      rippleDefaultDuration: 560,
      rippleExpandableDuration: 560,
    }),
  },
  spacious: {
    label: "Spacious",
    colorPreset: "sand",
    tokens: resolveThemePresetTokens({
      ...LAYOUT_PRESETS.spacious,
      letterSpacing: 0.01,
      shadowOpacity: 1.1,
      shadowBlur: 1.2,
      shadowSpread: 1.1,
      toastScrimSize: 1.1,
      fontFamily: '"Source Sans 3", ui-sans-serif, system-ui, sans-serif',
      fontWeights: { small: 400, base: 450, mid: 550, strong: 650, bold: 750 },
      interactiveDuration: 340,
      tooltipDuration: 240,
      modalDuration: 340,
      expandDuration: 260,
      surfaceTransitionDuration: 740,
      hoverLiftScale: 1.035,
      badgeAnchorHoverLiftScale: 1.065,
      pressSqueezeMid: 0.985,
      pressSqueezeDurationFactor: 1.25,
      rippleDefaultDuration: 820,
      rippleExpandableDuration: 820,
      interactiveEase: "power3.out",
      expandOpenEase: "power2.inOut",
    }),
  },
  flat: {
    label: "Flat",
    colorPreset: "default",
    tokens: resolveThemePresetTokens({
      ...LAYOUT_PRESETS.flat,
      radius: 0.25,
      shadowOpacity: 0,
      shadowBlur: 0.75,
      shadowSpread: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      focusRingWidth: 2,
      focusRingOffset: 1,
      toastScrimSize: 0.85,
      toastScrimDensity: 0.85,
      fontFamily: "Figtree, ui-sans-serif, system-ui, sans-serif",
      interactiveDuration: 200,
      tooltipDuration: 140,
      modalDuration: 220,
      expandDuration: 150,
      surfaceTransitionDuration: 320,
      hoverLiftScale: 1,
      badgeAnchorHoverLiftScale: 1.02,
      pressSqueezeMid: 0.99,
      enableHoverLift: false,
      enableRipple: false,
      rippleDefaultOpacityFrom: 0.2,
      rippleExpandableOpacityFrom: 0.16,
    }),
  },
  contrast: {
    label: "Contrast",
    colorPreset: "contrast",
    tokens: resolveThemePresetTokens({
      space: 0.5,
      size: 1,
      radius: 0.375,
      borderWidth: 1.5,
      textScale: 1,
      letterSpacing: 0,
      shadowOpacity: 1.35,
      shadowBlur: 1.1,
      shadowSpread: 1,
      shadowOffsetY: 1,
      focusRingWidth: 2.5,
      focusRingOffset: 1,
      toastScrimDensity: 1.15,
      fontFamily: "Roboto, ui-sans-serif, system-ui, sans-serif",
      fontWeights: { small: 500, base: 600, mid: 700, strong: 800, bold: 800 },
      interactiveDuration: 240,
      pressSqueezeMid: 0.96,
      pressSqueezeDurationFactor: 1.2,
      hoverLiftScale: 1.03,
      badgeAnchorHoverLiftScale: 1.06,
      interactiveEase: "power2.out",
      selectionFillEase: "back.out(1.6)",
    }),
  },
  soft: {
    label: "Soft",
    colorPreset: "lavender",
    tokens: resolveThemePresetTokens({
      space: 0.55,
      size: 1.05,
      radius: 0.85,
      borderWidth: 0.5,
      textScale: 1.02,
      letterSpacing: 0.015,
      shadowOpacity: 0.85,
      shadowBlur: 1.4,
      shadowSpread: 1.15,
      shadowOffsetY: 2,
      focusRingWidth: 2,
      focusRingOffset: 2,
      toastScrimSize: 1.15,
      toastScrimDensity: 0.9,
      fontFamily: '"Nunito Sans", ui-sans-serif, system-ui, sans-serif',
      fontFamilyMono: '"IBM Plex Mono", ui-monospace, monospace',
      fontWeights: { small: 400, base: 450, mid: 550, strong: 650, bold: 700 },
      interactiveDuration: 360,
      tooltipDuration: 260,
      modalDuration: 360,
      expandDuration: 280,
      switchThumbDuration: 400,
      surfaceTransitionDuration: 800,
      toastDismissDuration: 280,
      hoverLiftScale: 1.04,
      badgeAnchorHoverLiftScale: 1.07,
      pressSqueezeMid: 0.988,
      pressSqueezeDurationFactor: 1.3,
      rippleDefaultDuration: 900,
      rippleExpandableDuration: 900,
      rippleDefaultOpacityFrom: 0.36,
      rippleExpandableOpacityFrom: 0.28,
      interactiveEase: "sine.out",
      hoverLiftEase: "sine.inOut",
      expandOpenEase: "sine.inOut",
      switchThumbEase: "back.out(1.2)",
    }),
  },
  sharp: {
    label: "Sharp",
    colorPreset: "bold",
    tokens: resolveThemePresetTokens({
      space: 0.45,
      size: 0.95,
      radius: 0,
      borderWidth: 1.5,
      textScale: 0.98,
      letterSpacing: 0.02,
      shadowOpacity: 1.2,
      shadowBlur: 0.85,
      shadowSpread: 0.9,
      shadowOffsetY: 3,
      focusRingWidth: 2,
      focusRingOffset: 0,
      toastScrimSize: 0.95,
      fontFamily: "Outfit, ui-sans-serif, system-ui, sans-serif",
      fontFamilyMono: '"JetBrains Mono", ui-monospace, monospace',
      fontWeights: { small: 500, base: 600, mid: 700, strong: 800, bold: 800 },
      interactiveDuration: 180,
      tooltipDuration: 120,
      modalDuration: 200,
      expandDuration: 140,
      surfaceTransitionDuration: 280,
      toastDismissDuration: 160,
      hoverLiftScale: 1.01,
      badgeAnchorHoverLiftScale: 1.025,
      pressSqueezeMid: 0.965,
      pressSqueezeDurationFactor: 1,
      rippleDefaultDuration: 480,
      rippleExpandableDuration: 480,
      interactiveEase: "power4.out",
      expandOpenEase: "power2.out",
      selectionFillEase: "power3.out",
      enableHoverLift: true,
    }),
  },
  dense: {
    label: "Dense",
    colorPreset: "ocean",
    tokens: resolveThemePresetTokens({
      space: 0.35,
      size: 0.85,
      radius: 0.25,
      borderWidth: 1,
      textScale: 0.92,
      letterSpacing: -0.015,
      shadowOpacity: 0.8,
      shadowBlur: 0.85,
      shadowSpread: 0.95,
      focusRingWidth: 1.5,
      focusRingOffset: 0,
      toastScrimSize: 0.85,
      toastScrimDensity: 1.1,
      fontFamily: "Manrope, ui-sans-serif, system-ui, sans-serif",
      fontWeights: { small: 500, base: 550, mid: 650, strong: 750, bold: 800 },
      interactiveDuration: 200,
      tooltipDuration: 140,
      modalDuration: 220,
      expandDuration: 140,
      switchThumbDuration: 260,
      selectionFillDuration: 220,
      surfaceTransitionDuration: 360,
      hoverLiftScale: 1.012,
      badgeAnchorHoverLiftScale: 1.03,
      pressSqueezeMid: 0.975,
      pressSqueezeDurationFactor: 1.05,
      rippleDefaultDuration: 520,
      rippleExpandableDuration: 520,
      loadingDotsDuration: 720,
      progressFillDuration: 480,
    }),
  },
  airy: {
    label: "Airy",
    colorPreset: "peach",
    tokens: resolveThemePresetTokens({
      space: 0.7,
      size: 1.1,
      radius: 0.75,
      borderWidth: 1,
      textScale: 1.08,
      letterSpacing: 0.02,
      shadowOpacity: 1.05,
      shadowBlur: 1.25,
      shadowSpread: 1.1,
      shadowOffsetY: 1,
      focusRingWidth: 2,
      focusRingOffset: 2,
      toastScrimSize: 1.2,
      toastScrimDensity: 0.85,
      fontFamily: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
      fontFamilyMono: '"Source Code Pro", ui-monospace, monospace',
      fontWeights: { small: 400, base: 400, mid: 500, strong: 600, bold: 700 },
      interactiveDuration: 380,
      tooltipDuration: 260,
      modalDuration: 380,
      expandDuration: 300,
      switchThumbDuration: 420,
      surfaceTransitionDuration: 900,
      toastDismissDuration: 280,
      hoverLiftScale: 1.045,
      badgeAnchorHoverLiftScale: 1.08,
      pressSqueezeMid: 0.99,
      pressSqueezeDurationFactor: 1.35,
      rippleDefaultDuration: 960,
      rippleExpandableDuration: 960,
      rippleDefaultOpacityFrom: 0.38,
      rippleExpandableOpacityFrom: 0.3,
      feedbackExpandDuration: 860,
      interactiveEase: "power2.out",
      hoverLiftEase: "sine.inOut",
      expandOpenEase: "sine.inOut",
      switchThumbEase: "back.out(1.5)",
    }),
  },
} as const satisfies Record<string, ThemePresetDefinition>;

export type ThemePresetKey = keyof typeof THEME_PRESETS;

export const THEME_PRESET_LIST = (
  Object.entries(THEME_PRESETS) as [ThemePresetKey, ThemePresetDefinition][]
).map(([id, def]) => ({ id, label: def.label }));

/** Apply palette + full non-color token surface; keeps current light/dark mode. */
export function applyThemePresetToState(
  prev: ThemeEditorState,
  preset: ThemePresetKey,
): ThemeEditorState {
  const def = THEME_PRESETS[preset];
  const withColors = applyColorPresetToState(prev, def.colorPreset);
  return {
    ...withColors,
    ...def.tokens,
    fontWeights: { ...def.tokens.fontWeights },
    themePreset: preset,
    colorPreset: def.colorPreset,
  };
}

export const FONT_PRESETS = [
  { id: "system", label: "System UI", value: DEFAULT_FONT },
  { id: "inter", label: "Inter", value: "Inter, ui-sans-serif, system-ui, sans-serif" },
  { id: "geist", label: "Geist", value: "Geist, ui-sans-serif, system-ui, sans-serif" },
  {
    id: "plex-sans",
    label: "IBM Plex Sans",
    value: '"IBM Plex Sans", ui-sans-serif, system-ui, sans-serif',
  },
  { id: "dm-sans", label: "DM Sans", value: '"DM Sans", ui-sans-serif, system-ui, sans-serif' },
  { id: "manrope", label: "Manrope", value: "Manrope, ui-sans-serif, system-ui, sans-serif" },
  {
    id: "source-sans",
    label: "Source Sans 3",
    value: '"Source Sans 3", ui-sans-serif, system-ui, sans-serif',
  },
  { id: "outfit", label: "Outfit", value: "Outfit, ui-sans-serif, system-ui, sans-serif" },
  {
    id: "plus-jakarta",
    label: "Plus Jakarta Sans",
    value: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
  },
  { id: "roboto", label: "Roboto", value: "Roboto, ui-sans-serif, system-ui, sans-serif" },
  {
    id: "open-sans",
    label: "Open Sans",
    value: '"Open Sans", ui-sans-serif, system-ui, sans-serif',
  },
  { id: "figtree", label: "Figtree", value: "Figtree, ui-sans-serif, system-ui, sans-serif" },
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
  { id: "fira", label: "Fira Code", value: '"Fira Code", ui-monospace, monospace' },
  {
    id: "source-code-pro",
    label: "Source Code Pro",
    value: '"Source Code Pro", ui-monospace, monospace',
  },
  { id: "roboto-mono", label: "Roboto Mono", value: '"Roboto Mono", ui-monospace, monospace' },
  {
    id: "plex-mono",
    label: "IBM Plex Mono",
    value: '"IBM Plex Mono", ui-monospace, monospace',
  },
  { id: "space-mono", label: "Space Mono", value: '"Space Mono", ui-monospace, monospace' },
] as const;

export { DARK_COLORS, LIGHT_COLORS };
