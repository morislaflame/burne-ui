import { colorToken } from "@/tokens";

import type { ButtonStatus, ButtonVariant } from "./Button";

const BUTTON_CONVERGE_BG: Record<ButtonVariant, string> = {
  default: colorToken("converge-ripple-neutral"),
  primary: colorToken("converge-ripple-primary-fill"),
  outline: colorToken("converge-ripple-neutral"),
  secondary: colorToken("converge-ripple-neutral"),
  ghost: colorToken("converge-ripple-neutral"),
  gloss: colorToken("converge-ripple-neutral"),
};

const BUTTON_STATUS_CONVERGE_BG: Record<Exclude<ButtonStatus, "default">, string> = {
  danger: colorToken("converge-ripple-danger"),
  success: colorToken("converge-ripple-success"),
  info: colorToken("converge-ripple-info"),
  warning: colorToken("converge-ripple-warning"),
};

export function buttonRippleTone(
  variant: ButtonVariant,
  status: ButtonStatus = "default",
): string {
  if (status !== "default") return BUTTON_STATUS_CONVERGE_BG[status];
  return BUTTON_CONVERGE_BG[variant];
}
