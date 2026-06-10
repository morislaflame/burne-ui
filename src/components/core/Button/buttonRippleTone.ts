import { colorToken } from "@/tokens";

import type { ButtonVariant } from "./Button";

const BUTTON_CONVERGE_BG: Record<ButtonVariant, string> = {
  default: colorToken("converge-ripple-primary-fill"),
  outline: colorToken("converge-ripple-neutral"),
  secondary: colorToken("converge-ripple-neutral"),
  ghost: colorToken("converge-ripple-neutral"),
  danger: colorToken("converge-ripple-danger"),
  success: colorToken("converge-ripple-success"),
  info: colorToken("converge-ripple-info"),
  warning: colorToken("converge-ripple-warning"),
};

/** CSS-цвет converge-ripple под вариант кнопки — для собственного `<Ripple color={…} />` без `Button`. */
export function buttonRippleTone(variant: ButtonVariant): string {
  return BUTTON_CONVERGE_BG[variant];
}
