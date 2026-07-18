import type { ThemeColors } from "./themeDefaults";

/**
 * Default dark/light palettes — flat ThemeColors snapshots (same shape as Copy config).
 * Named presets live on the docs site / playground.
 */

const DARK_RIPPLE = {
  convergeRipplePrimaryFill:
    "color-mix(in oklab, var(--color-primary-foreground) 38%, transparent)",
  convergeRippleNeutral: "var(--color-primary-tint-strong)",
  convergeRippleNeutralMuted: "color-mix(in oklab, var(--color-primary) 14%, transparent)",
  convergeRippleDanger: "color-mix(in oklab, var(--color-danger-foreground) 38%, transparent)",
  convergeRippleSuccess:
    "color-mix(in oklab, var(--color-success-foreground) 38%, transparent)",
  convergeRippleInfo: "color-mix(in oklab, var(--color-info-foreground) 38%, transparent)",
  convergeRippleWarning:
    "color-mix(in oklab, var(--color-warning-foreground) 38%, transparent)",
} as const;

const LIGHT_RIPPLE = {
  convergeRipplePrimaryFill:
    "color-mix(in oklab, var(--color-primary-foreground) 52%, var(--color-primary))",
  convergeRippleNeutral: "var(--color-primary-tint-strong)",
  convergeRippleNeutralMuted: "color-mix(in oklab, var(--color-primary) 14%, transparent)",
  convergeRippleDanger: "color-mix(in oklab, var(--color-danger-foreground) 38%, transparent)",
  convergeRippleSuccess:
    "color-mix(in oklab, var(--color-success-foreground) 38%, transparent)",
  convergeRippleInfo: "color-mix(in oklab, var(--color-info-foreground) 38%, transparent)",
  convergeRippleWarning:
    "color-mix(in oklab, var(--color-warning-foreground) 38%, transparent)",
} as const;

export const DARK_COLORS: ThemeColors = {
  background: "#0c0d10",
  surface: "#171717",
  secondary: "#2D2D2D",
  secondaryForeground: "#f4f5f7",
  tertiary: "#454545",
  tertiaryForeground: "#f4f5f7",
  border: "color-mix(in oklab, var(--color-foreground) 12%, transparent)",
  foreground: "#f4f5f7",
  muted: "#8b90a0",
  primary: "#ebebef",
  primaryForeground: "#0c0c0e",
  primaryTint: "color-mix(in oklab, var(--color-primary) 20%, transparent)",
  primaryTintStrong: "color-mix(in oklab, var(--color-primary) 25%, transparent)",
  focusRing: "#ebebef",
  indicator: "#ebebef",
  indicatorForeground: "#0c0c0e",
  danger: "#dc2626",
  success: "#22c55e",
  info: "#0ea5e9",
  warning: "#f59e0b",
  dangerForeground: "#fafafa",
  successForeground: "#fafafa",
  infoForeground: "#fafafa",
  warningForeground: "#0c0c0e",
  primaryHover: "color-mix(in oklab, var(--color-primary) 80%, var(--color-surface))",
  defaultHover: "color-mix(in oklab, var(--color-foreground) 8%, var(--color-surface))",
  secondaryHover: "color-mix(in oklab, var(--color-foreground) 6%, var(--color-secondary))",
  tertiaryHover: "color-mix(in oklab, var(--color-foreground) 6%, var(--color-tertiary))",
  surfaceTintDanger: "color-mix(in oklab, var(--color-danger) 30%, black)",
  surfaceTintDangerHover: "color-mix(in oklab, var(--color-danger) 40%, black)",
  dangerFillHover: "color-mix(in oklab, var(--color-danger) 90%, black)",
  surfaceTintSuccess: "color-mix(in oklab, var(--color-success) 30%, black)",
  surfaceTintSuccessHover: "color-mix(in oklab, var(--color-success) 40%, black)",
  successFillHover: "color-mix(in oklab, var(--color-success) 90%, black)",
  surfaceTintInfo: "color-mix(in oklab, var(--color-info) 30%, black)",
  surfaceTintInfoHover: "color-mix(in oklab, var(--color-info) 40%, black)",
  infoFillHover: "color-mix(in oklab, var(--color-info) 90%, black)",
  surfaceTintWarning: "color-mix(in oklab, var(--color-warning) 30%, black)",
  surfaceTintWarningHover: "color-mix(in oklab, var(--color-warning) 40%, black)",
  warningFillHover: "color-mix(in oklab, var(--color-warning) 90%, black)",
  ...DARK_RIPPLE,
};

export const LIGHT_COLORS: ThemeColors = {
  background: "#f5f5f5",
  surface: "#ffffff",
  secondary: "#ebebec",
  secondaryForeground: "#18181b",
  tertiary: "#e2e2e4",
  tertiaryForeground: "#18181b",
  border: "color-mix(in oklab, var(--color-foreground) 12%, transparent)",
  foreground: "#18181b",
  muted: "#71717a",
  primary: "#18181b",
  primaryForeground: "#fafafa",
  primaryTint: "color-mix(in oklab, var(--color-primary) 20%, transparent)",
  primaryTintStrong: "color-mix(in oklab, var(--color-primary) 25%, transparent)",
  focusRing: "#18181b",
  indicator: "#18181b",
  indicatorForeground: "#fafafa",
  danger: "#dc2626",
  success: "#22c55e",
  info: "#0ea5e9",
  warning: "#f59e0b",
  dangerForeground: "#ffffff",
  successForeground: "#ffffff",
  infoForeground: "#ffffff",
  warningForeground: "#0c0c0e",
  primaryHover: "color-mix(in oklab, var(--color-primary) 80%, var(--color-surface))",
  defaultHover: "color-mix(in oklab, var(--color-foreground) 8%, var(--color-surface))",
  secondaryHover: "color-mix(in oklab, var(--color-foreground) 6%, var(--color-secondary))",
  tertiaryHover: "color-mix(in oklab, var(--color-foreground) 6%, var(--color-tertiary))",
  surfaceTintDanger: "color-mix(in oklab, var(--color-danger) 14%, white)",
  surfaceTintDangerHover: "color-mix(in oklab, var(--color-danger) 22%, white)",
  dangerFillHover: "color-mix(in oklab, var(--color-danger) 90%, black)",
  surfaceTintSuccess: "color-mix(in oklab, var(--color-success) 14%, white)",
  surfaceTintSuccessHover: "color-mix(in oklab, var(--color-success) 22%, white)",
  successFillHover: "color-mix(in oklab, var(--color-success) 90%, black)",
  surfaceTintInfo: "color-mix(in oklab, var(--color-info) 15%, white)",
  surfaceTintInfoHover: "color-mix(in oklab, var(--color-info) 22%, white)",
  infoFillHover: "color-mix(in oklab, var(--color-info) 90%, black)",
  surfaceTintWarning: "color-mix(in oklab, var(--color-warning) 14%, white)",
  surfaceTintWarningHover: "color-mix(in oklab, var(--color-warning) 22%, white)",
  warningFillHover: "color-mix(in oklab, var(--color-warning) 90%, black)",
  ...LIGHT_RIPPLE,
};
