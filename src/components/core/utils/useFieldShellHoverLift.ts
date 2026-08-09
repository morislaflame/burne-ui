import type { RefObject } from "react";

import type { FieldShellFilledVariant, FieldShellStatus } from "./fieldShellVariant";
import { fieldShellHoverVariantForShell } from "./fieldShellVariant";
import { hoverVariantBg } from "./hoverVariant";
import { useSecondLevelShadow } from "./useShadowMotion";
import { cn } from "@/utils/cn";

export type { FieldShellStatus };

/**
 * Field shell hover background via `hoverVariant` (variant only — status is ring accent).
 * `focus-within` — focus on inner control.
 */
export function fieldShellHoverClass(
  enabled: boolean,
  _status: FieldShellStatus = "default",
  variant: FieldShellFilledVariant = "default",
): string {
  if (!enabled) return "";
  return hoverVariantBg(fieldShellHoverVariantForShell(variant), "focus-within");
}

/** Shell transition: background, border, shadow, focus-ring (always, including disabled). */
export const FIELD_SHELL_TRANSITION_CLASS =
  "field-shell-transition motion-reduce:transition-none";

/** Outer focus ring on shell `:focus-within` (default status — `--color-focus-ring`). */
export const FIELD_SHELL_FOCUS_CLASS = "focus-within-ring";

/** Geometry shared with `focus-ring` / `focus-within-ring` utilities. */
const FIELD_SHELL_RING_GEOMETRY =
  "outline-solid outline-[length:var(--focus-ring-width,2px)] outline-offset-[length:var(--focus-ring-offset,0px)]";

/** Status ring fill from soft `--color-focus-ring-*` tokens. */
const FIELD_SHELL_STATUS_RING_COLOR: Record<Exclude<FieldShellStatus, "default">, string> = {
  danger:
    "outline-[var(--color-focus-ring-danger)] focus-within:outline-[var(--color-focus-ring-danger)]",
  success:
    "outline-[var(--color-focus-ring-success)] focus-within:outline-[var(--color-focus-ring-success)]",
  info: "outline-[var(--color-focus-ring-info)] focus-within:outline-[var(--color-focus-ring-info)]",
  warning:
    "outline-[var(--color-focus-ring-warning)] focus-within:outline-[var(--color-focus-ring-warning)]",
};

/**
 * Permanent status-colored outer ring (idle + focus). Keeps status focus-ring token on `:focus-within`
 * so `focus-within-ring` is not used for non-default status.
 */
export const FIELD_SHELL_STATUS_RING: Record<Exclude<FieldShellStatus, "default">, string> = {
  danger: cn(FIELD_SHELL_RING_GEOMETRY, FIELD_SHELL_STATUS_RING_COLOR.danger),
  success: cn(FIELD_SHELL_RING_GEOMETRY, FIELD_SHELL_STATUS_RING_COLOR.success),
  info: cn(FIELD_SHELL_RING_GEOMETRY, FIELD_SHELL_STATUS_RING_COLOR.info),
  warning: cn(FIELD_SHELL_RING_GEOMETRY, FIELD_SHELL_STATUS_RING_COLOR.warning),
};

/**
 * Focus / status ring for field shells.
 * - `default` → `focus-within-ring` (keyboard / focus only)
 * - status → always-visible status focus-ring token (same width/offset as focus-ring)
 */
export function fieldShellFocusRingClass(status: FieldShellStatus = "default"): string {
  if (status === "default") {
    return FIELD_SHELL_FOCUS_CLASS;
  }
  return FIELD_SHELL_STATUS_RING[status];
}

/**
 * Hover lift and same-family shadow for input-like field shells (`Input`, `TextArea`, `TimeField`, `ComboBox`).
 * Rest elevation is always applied while `enabled`; disable only turns off interactive motion.
 */
export function useFieldShellHoverLift(
  shellRef: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const lift = useSecondLevelShadow(shellRef, enabled, {
    interactive: enabled,
  });

  return {
    shellHoverMotionClass: lift.motionClass,
    onShellPointerEnter: lift.onPointerEnter,
    onShellPointerLeave: lift.onPointerLeave,
  };
}
