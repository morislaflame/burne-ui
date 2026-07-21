import type { RefObject } from "react";

import type { FieldShellFilledVariant } from "./fieldShellVariant";
import { fieldShellHoverVariantForShell } from "./fieldShellVariant";
import { hoverVariantBg, type HoverVariant } from "./hoverVariant";
import { useSecondLevelShadow } from "./useShadowMotion";

export type FieldShellStatus = "default" | "danger" | "success" | "info" | "warning";

/** Field status tint background → stronger tint on hover (not *-fill like filled buttons). */
const FIELD_SHELL_HOVER_VARIANT: Record<FieldShellStatus, HoverVariant> = {
  default: "default",
  danger: "danger-tint-hover",
  success: "success-tint-hover",
  info: "info-tint-hover",
  warning: "warning-tint-hover",
};

/** Field shell hover background via `hoverVariant`; `focus-within` — focus on inner control. */
export function fieldShellHoverClass(
  enabled: boolean,
  status: FieldShellStatus = "default",
  variant: FieldShellFilledVariant = "default",
): string {
  if (!enabled) return "";
  const hoverVariant: HoverVariant =
    status !== "default"
      ? FIELD_SHELL_HOVER_VARIANT[status]
      : fieldShellHoverVariantForShell(variant);
  return hoverVariantBg(hoverVariant, "focus-within");
}

/** Shell transition: background, shadow, focus-ring (always, including disabled). */
export const FIELD_SHELL_TRANSITION_CLASS =
  "field-shell-transition motion-reduce:transition-none";

/** Outer primary focus ring on shell `:focus-within`. */
export const FIELD_SHELL_FOCUS_CLASS = "focus-within-ring";

/**
 * Hover lift and sm → md shadow for input-like field shells (`Input`, `TextArea`, `TimeField`, `ComboBox`).
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
