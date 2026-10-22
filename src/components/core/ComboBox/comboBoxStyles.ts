import { CONTROL_SIZE_LAYOUT, iconSlotClass } from "@/components/core/utils/sizeLayout";
import { FIELD_CONTROL_MOBILE_NO_ZOOM_CLASS } from "@/components/core/utils/fieldControlMobileNoZoom";
import { FIELD_SHELL_TRANSITION_CLASS, fieldShellFocusRingClass, fieldShellHoverClass } from "@/components/core/utils/useFieldShellHoverLift";
import { buttonGroupRoundingClasses, buttonGroupSegmentSurfaceClasses } from "@/components/composite/ButtonGroup/buttonGroupStyles";
import type { ButtonGroupSegment } from "@/components/composite/ButtonGroup/buttonGroupTypes";
import type { InputSize, InputVariant } from "@/components/core/Input";
import { KIT_INPUT_VARIANTS } from "@/components/core/Input/inputTypes";
import { resolveFieldShellSurfaceClass, type FieldShellStatus } from "@/components/core/utils/fieldShellVariant";
import { usesKitElevation, resolveVariantVisual } from "@/skins/resolveVariantVisual";
import { cn } from "@/utils/cn";
 
export const COMBOBOX_LOADING_CLASS = "px-mid py-small text-muted";

export const COMBOBOX_INPUT_CONTROL: Record<InputSize, string> = {
  small: CONTROL_SIZE_LAYOUT.small.controlPad,
  base: CONTROL_SIZE_LAYOUT.base.controlPad,
  mid: CONTROL_SIZE_LAYOUT.mid.controlPad,
  large: CONTROL_SIZE_LAYOUT.large.controlPad,
};
 
export const COMBOBOX_CHEVRON_ICON_SLOT: Record<InputSize, string> = {
  small: iconSlotClass("small"),
  base: iconSlotClass("base"),
  mid: iconSlotClass("mid"),
  large: iconSlotClass("large"),
};
 
export const COMBOBOX_INPUT_GROUP_BASE_CLASS =
  "relative z-0 flex min-w-0 items-stretch border-1 text-start overflow-hidden motion-reduce:transition-none";
 
export const COMBOBOX_INPUT_BASE_CLASS =
  `min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted ${FIELD_CONTROL_MOBILE_NO_ZOOM_CLASS}`;
 
export const COMBOBOX_INPUT_MUTED_CLASS = "text-muted";
 
export const COMBOBOX_TRIGGER_BASE_CLASS =
  "flex shrink-0 origin-center items-center justify-center self-stretch px-small outline-none text-muted hover:text-foreground focus-ring-inset";
 
export const COMBOBOX_TRIGGER_DISABLED_CLASS = "pointer-events-none";
 
export const COMBOBOX_POPOVER_CLASS = "z-popover";
 
export const COMBOBOX_POPOVER_BODY_CLASS = "gap-0 p-base";
 
export const COMBOBOX_LISTBOX_CLASS = "overflow-y-auto overflow-x-hidden";
 
export const COMBOBOX_INPUT_GROUP_DISABLED_CLASS =
  "cursor-not-allowed opacity-55";
 
export const COMBOBOX_INPUT_GROUP_ENABLED_CLASS = "cursor-pointer";
 
export function comboBoxShellSurface({
  variant,
}: {
  variant: InputVariant;
}): string {
  const visual = resolveVariantVisual(variant, KIT_INPUT_VARIANTS, "comboBox.shell");
  if (visual.className !== undefined) return visual.className;
  return resolveFieldShellSurfaceClass({ variant });
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
  status: FieldShellStatus;
  disabled: boolean;
  groupSegment?: ButtonGroupSegment;
  shellHoverMotionClass: string;
  className?: string;
  slotClass?: string;
}): string {
  const kitSurface = usesKitElevation(variant, KIT_INPUT_VARIANTS);
 
  return cn(
    COMBOBOX_INPUT_GROUP_BASE_CLASS,
    groupSegment?.orientation === "horizontal" ? "flex-1" : "w-full",
    comboBoxGroupShellClass(groupSegment),
    comboBoxShellSurface({ variant }),
    FIELD_SHELL_TRANSITION_CLASS,
    fieldShellFocusRingClass(status),
    kitSurface && fieldShellHoverClass(!disabled, status, variant),
    shellHoverMotionClass,
    disabled
      ? COMBOBOX_INPUT_GROUP_DISABLED_CLASS
      : COMBOBOX_INPUT_GROUP_ENABLED_CLASS,
    slotClass,
    className,
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
  return cn(
    COMBOBOX_INPUT_BASE_CLASS,
    COMBOBOX_INPUT_CONTROL[size],
    muted && COMBOBOX_INPUT_MUTED_CLASS,
    FIELD_CONTROL_MOBILE_NO_ZOOM_CLASS,
    slotClass,
    className,
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
  return cn(
    COMBOBOX_TRIGGER_BASE_CLASS,
    disabled && COMBOBOX_TRIGGER_DISABLED_CLASS,
    slotClass,
    className,
  );
}

export function comboBoxTriggerIconWrapClass(size: InputSize, slotClass?: string): string {
  return cn(COMBOBOX_CHEVRON_ICON_SLOT[size], slotClass);
}

export function comboBoxTriggerIconClass(slotClass?: string): string {
  return cn(slotClass);
}
 