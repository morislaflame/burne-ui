import { CONTROL_SIZE_LAYOUT } from "@/components/core/utils/controlSizeLayout";
import {
  FIELD_SHELL_FOCUS_CLASS,
  FIELD_SHELL_TRANSITION_CLASS,
  fieldShellHoverClass,
} from "@/components/core/utils/useFieldShellHoverLift";
import {
  buttonGroupRoundingClasses,
  buttonGroupSegmentSurfaceClasses,
} from "@/components/composite/ButtonGroup/buttonGroupStyles";
import type { ButtonGroupSegment } from "@/components/composite/ButtonGroup/buttonGroupTypes";
import type { InputSize, InputStatus, InputVariant } from "@/components/core/Input";
import { cn } from "@/utils/cn";

import { mergeComboBoxSlotClass } from "./comboBoxAPI";

const VARIANT_SHELL: Record<Exclude<InputVariant, "gloss">, string> = {
  default: "bg-surface",
  outline: "bg-transparent",
};

const STATUS_TINT_SHELL: Record<Exclude<InputStatus, "default">, string> = {
  danger: "bg-surface-tint-danger",
  success: "bg-surface-tint-success",
  warning: "bg-surface-tint-warning",
};

export const COMBOBOX_INPUT_SHELL_H: Record<InputSize, string> = {
  small: CONTROL_SIZE_LAYOUT.small.h,
  base: CONTROL_SIZE_LAYOUT.base.h,
  mid: CONTROL_SIZE_LAYOUT.mid.h,
  large: CONTROL_SIZE_LAYOUT.large.h,
};

export const COMBOBOX_INPUT_CONTROL: Record<InputSize, string> = {
  small: CONTROL_SIZE_LAYOUT.small.controlPad,
  base: CONTROL_SIZE_LAYOUT.base.controlPad,
  mid: CONTROL_SIZE_LAYOUT.mid.controlPad,
  large: CONTROL_SIZE_LAYOUT.large.controlPad,
};

export const COMBOBOX_CHEVRON_ICON: Record<InputSize, string> = {
  small: CONTROL_SIZE_LAYOUT.small.chevronIcon,
  base: CONTROL_SIZE_LAYOUT.base.chevronIcon,
  mid: CONTROL_SIZE_LAYOUT.mid.chevronIcon,
  large: CONTROL_SIZE_LAYOUT.large.chevronIcon,
};

export const COMBOBOX_INPUT_GROUP_BASE_CLASS =
  "relative z-0 flex min-w-0 items-stretch border-1 text-left overflow-hidden motion-reduce:transition-none";

export const COMBOBOX_INPUT_BASE_CLASS =
  "min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted";

export const COMBOBOX_INPUT_MUTED_CLASS = "text-muted";

export const COMBOBOX_TRIGGER_BASE_CLASS =
  "flex shrink-0 origin-center items-center justify-center self-stretch px-small outline-none text-muted hover:text-foreground focus-ring";

export const COMBOBOX_TRIGGER_DISABLED_CLASS = "pointer-events-none";

export const COMBOBOX_POPOVER_CLASS = "z-[100]";

export const COMBOBOX_POPOVER_BODY_CLASS = "gap-0 p-base";

export const COMBOBOX_LISTBOX_CLASS = "overflow-y-auto overflow-x-hidden";

export const COMBOBOX_INPUT_GROUP_DISABLED_CLASS =
  "cursor-not-allowed opacity-55 shadow-token-base";

export const COMBOBOX_INPUT_GROUP_ENABLED_CLASS = "cursor-pointer";

export function comboBoxShellSurface({
  variant,
  status,
}: {
  variant: InputVariant;
  status: InputStatus;
}): string {
  const statusTinted =
    status === "danger" || status === "success" || status === "warning";

  if (variant === "gloss") return "gloss-control";

  if (statusTinted) {
    return cn(STATUS_TINT_SHELL[status], "border-token");
  }

  return cn(
    variant === "outline"
      ? "bg-transparent border-token"
      : cn(VARIANT_SHELL[variant], "border-token"),
  );
}

export function comboBoxGroupShellClass(groupSegment?: ButtonGroupSegment): string {
  if (groupSegment) {
    return cn(
      buttonGroupRoundingClasses(groupSegment),
      buttonGroupSegmentSurfaceClasses(groupSegment),
    );
  }
  return "rounded-base";
}

export function comboBoxInputGroupClass({
  size,
  variant,
  status,
  disabled,
  groupSegment,
  shellHoverMotionClass,
  className,
  slotClass,
}: {
  size: InputSize;
  variant: InputVariant;
  status: InputStatus;
  disabled: boolean;
  groupSegment?: ButtonGroupSegment;
  shellHoverMotionClass: string;
  className?: string;
  slotClass?: string;
}): string {
  const isGloss = variant === "gloss";

  return mergeComboBoxSlotClass(
    COMBOBOX_INPUT_GROUP_BASE_CLASS,
    groupSegment?.orientation === "horizontal" ? "flex-1" : "w-full",
    COMBOBOX_INPUT_SHELL_H[size],
    comboBoxGroupShellClass(groupSegment),
    comboBoxShellSurface({ variant, status }),
    FIELD_SHELL_TRANSITION_CLASS,
    FIELD_SHELL_FOCUS_CLASS,
    isGloss ? "" : fieldShellHoverClass(!disabled, status),
    shellHoverMotionClass,
    disabled
      ? COMBOBOX_INPUT_GROUP_DISABLED_CLASS
      : COMBOBOX_INPUT_GROUP_ENABLED_CLASS,
    className,
    slotClass,
  );
}

export function comboBoxInputClass({
  size,
  muted,
  className,
  slotClass,
}: {
  size: InputSize;
  muted: boolean;
  className?: string;
  slotClass?: string;
}): string {
  return mergeComboBoxSlotClass(
    COMBOBOX_INPUT_BASE_CLASS,
    COMBOBOX_INPUT_CONTROL[size],
    muted && COMBOBOX_INPUT_MUTED_CLASS,
    className,
    slotClass,
  );
}

export function comboBoxTriggerClass({
  disabled,
  className,
  slotClass,
}: {
  disabled: boolean;
  className?: string;
  slotClass?: string;
}): string {
  return mergeComboBoxSlotClass(
    COMBOBOX_TRIGGER_BASE_CLASS,
    disabled && COMBOBOX_TRIGGER_DISABLED_CLASS,
    className,
    slotClass,
  );
}
