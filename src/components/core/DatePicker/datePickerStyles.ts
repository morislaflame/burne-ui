import { CONTROL_SIZE_LAYOUT } from "@/components/core/utils/sizeLayout";
import { resolveFieldShellSurfaceClass } from "@/components/core/utils/fieldShellVariant";
import { iconSlotClass, type IconSlotStep } from "@/components/core/utils/sizeLayout/iconSlot";
import {
  FIELD_SHELL_TRANSITION_CLASS,
  fieldShellFocusRingClass,
  fieldShellHoverClass,
} from "@/components/core/utils/useFieldShellHoverLift";
import { KIT_INPUT_VARIANTS, type InputSize, type InputStatus, type InputVariant } from "@/components/core/Input/inputTypes";
import { isKitVariant, resolveVariantVisual } from "@/skins/resolveVariantVisual";
import { cn } from "@/utils/cn";

export const DATE_PICKER_ROOT_CLASS = "w-fit max-w-full min-w-0";

export const DATE_PICKER_TRIGGER_PAD: Record<InputSize, string> = {
  small: CONTROL_SIZE_LAYOUT.small.controlPad,
  base: CONTROL_SIZE_LAYOUT.base.controlPad,
  mid: CONTROL_SIZE_LAYOUT.mid.controlPad,
  large: CONTROL_SIZE_LAYOUT.large.controlPad,
};

export const DATE_PICKER_TRIGGER_MIN: Record<InputSize, string> = {
  small: "min-h-control-small",
  base: "min-h-control-base",
  mid: "min-h-control-mid",
  large: "min-h-control-large",
};

const DATE_PICKER_ICON_STEP: Record<InputSize, IconSlotStep> = {
  small: "small",
  base: "base",
  mid: "mid",
  large: "large",
};

export const DATE_PICKER_VALUE_CLASS = "min-w-0 flex-1 truncate text-start";

export const DATE_PICKER_VALUE_MUTED_CLASS = "text-muted";

export const DATE_PICKER_ICON_CLASS = "shrink-0 text-muted";

export const DATE_PICKER_TRIGGER_DISABLED_CLASS = "cursor-not-allowed opacity-55 shadow-token-base";

export const DATE_PICKER_POPOVER_CLASS = "z-popover";

/** Popover shell stays clear so the calendar is the only card. */
export const DATE_PICKER_POPOVER_PANEL_CLASS = "border-0 bg-transparent shadow-none overflow-visible";

export function datePickerIconClass(size: InputSize): string {
  return iconSlotClass(DATE_PICKER_ICON_STEP[size]);
}

export function datePickerShellSurface(variant: InputVariant): string {
  const visual = resolveVariantVisual(variant, KIT_INPUT_VARIANTS, "datePicker.trigger");
  if (visual.className !== undefined) return visual.className;
  return resolveFieldShellSurfaceClass({ variant });
}

export function datePickerTriggerClass({
  size,
  variant,
  status,
  disabled,
  shellHoverMotionClass,
  slotClass,
  className,
}: {
  size: InputSize;
  variant: InputVariant;
  status: InputStatus;
  disabled: boolean;
  shellHoverMotionClass?: string;
  slotClass?: string;
  className?: string;
}): string {
  const kitSurface = isKitVariant(variant, KIT_INPUT_VARIANTS);
  return cn(
    "relative flex w-auto min-w-0 items-center gap-small border-1 text-start rounded-base",
    DATE_PICKER_TRIGGER_MIN[size],
    DATE_PICKER_TRIGGER_PAD[size],
    datePickerShellSurface(variant),
    fieldShellFocusRingClass(status),
    FIELD_SHELL_TRANSITION_CLASS,
    disabled
      ? DATE_PICKER_TRIGGER_DISABLED_CLASS
      : cn("cursor-pointer", kitSurface && fieldShellHoverClass(true, status, variant)),
    shellHoverMotionClass,
    slotClass,
    className,
  );
}
