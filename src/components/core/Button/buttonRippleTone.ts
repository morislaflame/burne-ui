import { colorToken } from "@/tokens";

import type { ButtonVariant } from "./Button";

const BUTTON_CONVERGE_BG: Record<ButtonVariant, string> = {
  default: colorToken("converge-ripple-accent-fill"),
  outline: colorToken("converge-ripple-accent-soft"),
  secondary: colorToken("converge-ripple-secondary"),
  ghost: colorToken("converge-ripple-accent-soft"),
  danger: colorToken("converge-ripple-danger"),
  success: colorToken("converge-ripple-success"),
  info: colorToken("converge-ripple-info"),
  warning: colorToken("converge-ripple-warning"),
};

/** CSS-цвет converge-ripple под вариант кнопки — для собственного `<Ripple color={…} />` без `Button`. */
export function buttonRippleTone(variant: ButtonVariant): string {
  return BUTTON_CONVERGE_BG[variant];
}
