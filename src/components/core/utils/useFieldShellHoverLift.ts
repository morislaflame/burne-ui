import type { RefObject } from "react";

import { hoverVariantBg, type HoverVariant } from "./hoverVariant";
import { useSecondLevelShadow } from "./useShadowMotion";

export type FieldShellStatus = "default" | "danger" | "success" | "warning";

/** Статусный tint-фон поля → усиленный tint на hover (не *-fill как у залитых кнопок). */
const FIELD_SHELL_HOVER_VARIANT: Record<FieldShellStatus, HoverVariant> = {
  default: "default",
  danger: "danger-tint-hover",
  success: "success-tint-hover",
  warning: "warning-tint-hover",
};

/** Hover-фон оболочки поля через `hoverVariant`; `focus-within` — фокус на внутреннем control. */
export function fieldShellHoverClass(
  enabled: boolean,
  status: FieldShellStatus = "default",
): string {
  if (!enabled) return "";
  return hoverVariantBg(FIELD_SHELL_HOVER_VARIANT[status], "focus-within");
}

/** Transition оболочки: фон, тень, focus-ring (всегда, в t.ч. disabled). */
export const FIELD_SHELL_TRANSITION_CLASS =
  "field-shell-transition motion-reduce:transition-none";

/** Внешнее focus-кольцо primary при `:focus-within` на оболочке. */
export const FIELD_SHELL_FOCUS_CLASS = "focus-within-ring";

/**
 * Hover-подъём и sm → md тень для оболочки input-like полей (`Input`, `TextArea`, `TimeField`, `ComboBox`).
 */
export function useFieldShellHoverLift(
  shellRef: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const lift = useSecondLevelShadow(shellRef, enabled);

  return {
    shellHoverMotionClass: lift.motionClass,
    onShellPointerEnter: lift.onPointerEnter,
    onShellPointerLeave: lift.onPointerLeave,
  };
}
