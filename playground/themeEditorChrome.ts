/**
 * Theme builder UI chrome (labels / dropdown options).
 * Lives in playground & docs site only — not part of the burne-ui public API.
 */
import type { ThemeColorKey, ThemeFontWeightKey, ThemeStatusForegroundKey } from "./themeDefaults";

export const SCALE_TOKEN_LABELS = {
  space: "Spacing",
  size: "Control size",
  radius: "Radius",
  borderWidth: "Border width",
  focusRingWidth: "Focus ring width",
  focusRingOffset: "Focus ring offset",
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
  dangerForeground: "Danger foreground",
  successForeground: "Success foreground",
  infoForeground: "Info foreground",
  warningForeground: "Warning foreground",
  primaryHover: "Primary hover",
  defaultHover: "Default hover",
  secondaryHover: "Secondary hover",
  tertiaryHover: "Tertiary hover",
  surfaceTintDanger: "Danger surface tint",
  surfaceTintDangerHover: "Danger surface tint hover",
  dangerFillHover: "Danger fill hover",
  surfaceTintSuccess: "Success surface tint",
  surfaceTintSuccessHover: "Success surface tint hover",
  successFillHover: "Success fill hover",
  surfaceTintInfo: "Info surface tint",
  surfaceTintInfoHover: "Info surface tint hover",
  infoFillHover: "Info fill hover",
  surfaceTintWarning: "Warning surface tint",
  surfaceTintWarningHover: "Warning surface tint hover",
  warningFillHover: "Warning fill hover",
  convergeRipplePrimaryFill: "Ripple primary fill",
  convergeRippleNeutral: "Ripple neutral",
  convergeRippleNeutralMuted: "Ripple neutral muted",
  convergeRippleDanger: "Ripple danger",
  convergeRippleSuccess: "Ripple success",
  convergeRippleInfo: "Ripple info",
  convergeRippleWarning: "Ripple warning",
};

export const STATUS_FOREGROUND_LABELS: Record<ThemeStatusForegroundKey, string> = {
  dangerForeground: "Danger foreground",
  successForeground: "Success foreground",
  infoForeground: "Info foreground",
  warningForeground: "Warning foreground",
};
