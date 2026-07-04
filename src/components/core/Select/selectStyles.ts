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
import { resolveFieldShellSurfaceClass } from "@/components/core/utils/fieldShellVariant";
import { cn } from "@/utils/cn";

import { mergeSelectSlotClass } from "./selectAPI";

const STATUS_TINT_SHELL: Record<Exclude<InputStatus, "default">, string> = {
  danger: "bg-surface-tint-danger",
  success: "bg-surface-tint-success",
  warning: "bg-surface-tint-warning",
};

export const SELECT_VALUE_CONTROL: Record<InputSize, string> = {
  small: CONTROL_SIZE_LAYOUT.small.controlPad,
  base: CONTROL_SIZE_LAYOUT.base.controlPad,
  mid: CONTROL_SIZE_LAYOUT.mid.controlPad,
  large: CONTROL_SIZE_LAYOUT.large.controlPad,
};

export const SELECT_CHEVRON_ICON: Record<InputSize, string> = {
  small: CONTROL_SIZE_LAYOUT.small.chevronIcon,
  base: CONTROL_SIZE_LAYOUT.base.chevronIcon,
  mid: CONTROL_SIZE_LAYOUT.mid.chevronIcon,
  large: CONTROL_SIZE_LAYOUT.large.chevronIcon,
};

export const SELECT_TRIGGER_GROUP_BASE_CLASS =
  "relative z-0 flex min-w-0 items-stretch border-1 text-left overflow-hidden motion-reduce:transition-none";

export const SELECT_VALUE_BASE_CLASS =
  "min-w-0 flex-1 truncate bg-transparent text-left text-foreground outline-none focus-ring";

export const SELECT_VALUE_MUTED_CLASS = "text-muted";

export const SELECT_TRIGGER_BASE_CLASS =
  "flex shrink-0 origin-center items-center justify-center self-stretch px-small outline-none text-muted hover:text-foreground focus-ring";

export const SELECT_TRIGGER_DISABLED_CLASS = "pointer-events-none";

/** Above Dialog/Drawer (`z-[100]`), aligned with Dropdown submenus. */
export const SELECT_POPOVER_CLASS = "z-[110]";

export const SELECT_POPOVER_BODY_CLASS = "gap-0 p-base";

export const SELECT_LISTBOX_CLASS = "overflow-y-auto overflow-x-hidden";

export const SELECT_TRIGGER_GROUP_DISABLED_CLASS =
  "cursor-not-allowed opacity-55 shadow-token-base";

export const SELECT_TRIGGER_GROUP_ENABLED_CLASS = "cursor-pointer";

export function selectShellSurface({
  variant,
  status,
}: {
  variant: InputVariant;
  status: InputStatus;
}): string {
  const statusTinted =
    status === "danger" || status === "success" || status === "warning";

  return resolveFieldShellSurfaceClass({
    variant,
    statusTinted,
    statusTintClass: statusTinted ? STATUS_TINT_SHELL[status] : "",
  });
}

export function selectGroupShellClass(groupSegment?: ButtonGroupSegment): string {
  if (groupSegment) {
    return cn(
      buttonGroupRoundingClasses(groupSegment),
      buttonGroupSegmentSurfaceClasses(groupSegment),
    );
  }
  return "rounded-base";
}

export function selectTriggerGroupClass({
  variant,
  status,
  disabled,
  groupSegment,
  shellHoverMotionClass,
  className,
  slotClass,
}: {
  variant: InputVariant;
  status: InputStatus;
  disabled: boolean;
  groupSegment?: ButtonGroupSegment;
  shellHoverMotionClass: string;
  className?: string;
  slotClass?: string;
}): string {
  const isGloss = variant === "gloss";

  return mergeSelectSlotClass(
    SELECT_TRIGGER_GROUP_BASE_CLASS,
    groupSegment?.orientation === "horizontal" ? "flex-1" : "w-full",
    selectGroupShellClass(groupSegment),
    selectShellSurface({ variant, status }),
    FIELD_SHELL_TRANSITION_CLASS,
    FIELD_SHELL_FOCUS_CLASS,
    isGloss ? "" : fieldShellHoverClass(!disabled, status, variant),
    shellHoverMotionClass,
    disabled
      ? SELECT_TRIGGER_GROUP_DISABLED_CLASS
      : SELECT_TRIGGER_GROUP_ENABLED_CLASS,
    className,
    slotClass,
  );
}

export function selectValueClass({
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
  return mergeSelectSlotClass(
    SELECT_VALUE_BASE_CLASS,
    SELECT_VALUE_CONTROL[size],
    muted && SELECT_VALUE_MUTED_CLASS,
    className,
    slotClass,
  );
}

export function selectTriggerClass({
  disabled,
  className,
  slotClass,
}: {
  disabled: boolean;
  className?: string;
  slotClass?: string;
}): string {
  return mergeSelectSlotClass(
    SELECT_TRIGGER_BASE_CLASS,
    disabled && SELECT_TRIGGER_DISABLED_CLASS,
    className,
    slotClass,
  );
}
