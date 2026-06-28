import { colorToken } from "@/tokens";

export const RIPPLE_COLOR = {
  primarySolid: colorToken("converge-ripple-primary-fill"),
  neutral: colorToken("converge-ripple-neutral"),
  neutralMuted: colorToken("converge-ripple-neutral-muted"),
  danger: colorToken("converge-ripple-danger"),
  success: colorToken("converge-ripple-success"),
  info: colorToken("converge-ripple-info"),
  warning: colorToken("converge-ripple-warning"),
} as const;

export type RippleColor = keyof typeof RIPPLE_COLOR;
