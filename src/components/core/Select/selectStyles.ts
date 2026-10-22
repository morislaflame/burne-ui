import { CONTROL_SIZE_LAYOUT, iconSlotClass } from "@/components/core/utils/sizeLayout";
import { FIELD_SHELL_TRANSITION_CLASS, fieldShellFocusRingClass, fieldShellHoverClass } from "@/components/core/utils/useFieldShellHoverLift";
import { buttonGroupRoundingClasses, buttonGroupSegmentSurfaceClasses } from "@/components/composite/ButtonGroup/buttonGroupStyles";
import type { ButtonGroupSegment } from "@/components/composite/ButtonGroup/buttonGroupTypes";
import type { InputSize, InputVariant } from "@/components/core/Input";
import { KIT_INPUT_VARIANTS } from "@/components/core/Input/inputTypes";
import { resolveFieldShellSurfaceClass, type FieldShellStatus } from "@/components/core/utils/fieldShellVariant";
import { usesKitElevation, resolveVariantVisual } from "@/skins/resolveVariantVisual";
import { cn } from "@/utils/cn";
 
export const SELECT_VALUE_CONTROL: Record<InputSize, string> = {
  small: CONTROL_SIZE_LAYOUT.small.controlPad,
  base: CONTROL_SIZE_LAYOUT.base.controlPad,
  mid: CONTROL_SIZE_LAYOUT.mid.controlPad,
  large: CONTROL_SIZE_LAYOUT.large.controlPad,
};
 
export const SELECT_CHEVRON_ICON_SLOT: Record<InputSize, string> = {
  small: iconSlotClass("small"),
  base: iconSlotClass("base"),
  mid: iconSlotClass("mid"),
  large: iconSlotClass("large"),
};
 
export const SELECT_TRIGGER_GROUP_BASE_CLASS =
  "relative z-0 flex min-w-0 items-stretch border-1 text-start overflow-hidden motion-reduce:transition-none";
 
export const SELECT_CLEAR_CLASS =
  "inline-flex shrink-0 items-center self-center text-muted icon-slot icon-slot-base focus-ring";

/** Matches the value's inline start padding so the glyph sits the same distance from the end edge. */
const SELECT_CLEAR_END_PAD: Record<InputSize, string> = {
  small: "pe-base",
  base: "pe-mid",
  mid: "pe-large",
  large: "pe-xlarge",
};

export function selectClearClass(size: InputSize): string {
  return cn(SELECT_CLEAR_CLASS, SELECT_CLEAR_END_PAD[size]);
}

export const SELECT_VALUE_BASE_CLASS =
  "min-w-0 flex-1 truncate bg-transparent text-start text-foreground outline-none";
 
export const SELECT_VALUE_MUTED_CLASS = "text-muted";
 
export const SELECT_TRIGGER_BASE_CLASS =
  "flex shrink-0 origin-center items-center justify-center self-stretch px-small outline-none text-muted hover:text-foreground focus-ring-inset";
 
export const SELECT_TRIGGER_DISABLED_CLASS = "pointer-events-none";
 
/** Same band as Popover; above Dialog when sharing a stacking context (not `showModal` top layer). */
export const SELECT_POPOVER_CLASS = "z-popover";
 
export const SELECT_POPOVER_BODY_CLASS = "gap-0 p-base";
 
export const SELECT_LISTBOX_CLASS = "overflow-y-auto overflow-x-hidden";
 
export const SELECT_TRIGGER_GROUP_DISABLED_CLASS =
  "cursor-not-allowed opacity-55";
 
export const SELECT_TRIGGER_GROUP_ENABLED_CLASS = "cursor-pointer";
 
export function selectShellSurface({
  variant,
}: {
  variant: InputVariant;
}): string {
  const visual = resolveVariantVisual(variant, KIT_INPUT_VARIANTS, "select.shell");
  if (visual.className !== undefined) return visual.className;
  return resolveFieldShellSurfaceClass({ variant });
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
  status: FieldShellStatus;
  disabled: boolean;
  groupSegment?: ButtonGroupSegment;
  shellHoverMotionClass: string;
  className?: string;
  slotClass?: string;
}): string {
  const kitSurface = usesKitElevation(variant, KIT_INPUT_VARIANTS);
 
  return cn(
    SELECT_TRIGGER_GROUP_BASE_CLASS,
    groupSegment?.orientation === "horizontal" ? "flex-1" : "w-full",
    selectGroupShellClass(groupSegment),
    selectShellSurface({ variant }),
    FIELD_SHELL_TRANSITION_CLASS,
    fieldShellFocusRingClass(status),
    kitSurface && fieldShellHoverClass(!disabled, status, variant),
    shellHoverMotionClass,
    disabled
      ? SELECT_TRIGGER_GROUP_DISABLED_CLASS
      : SELECT_TRIGGER_GROUP_ENABLED_CLASS,
    slotClass,
    className,
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
  return cn(
    SELECT_VALUE_BASE_CLASS,
    SELECT_VALUE_CONTROL[size],
    muted && SELECT_VALUE_MUTED_CLASS,
    slotClass,
    className,
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
  return cn(
    SELECT_TRIGGER_BASE_CLASS,
    disabled && SELECT_TRIGGER_DISABLED_CLASS,
    slotClass,
    className,
  );
}

export function selectTriggerIconWrapClass(size: InputSize, slotClass?: string): string {
  return cn(SELECT_CHEVRON_ICON_SLOT[size], slotClass);
}

export function selectTriggerIconClass(slotClass?: string): string {
  return cn(slotClass);
}
 