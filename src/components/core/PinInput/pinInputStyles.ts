import { CONTROL_SIZE_LAYOUT } from "@/components/core/utils/sizeLayout";
import { FIELD_CONTROL_MOBILE_NO_ZOOM_CLASS } from "@/components/core/utils/fieldControlMobileNoZoom";
import { resolveFieldShellSurfaceClass } from "@/components/core/utils/fieldShellVariant";
import {
  FIELD_SHELL_TRANSITION_CLASS,
  fieldShellFocusRingClass,
  fieldShellHoverClass,
} from "@/components/core/utils/useFieldShellHoverLift";
import { KIT_INPUT_VARIANTS, type InputSize, type InputStatus, type InputVariant } from "@/components/core/Input/inputTypes";
import { isKitVariant, resolveVariantVisual } from "@/skins/resolveVariantVisual";
import { cn } from "@/utils/cn";

export const PIN_INPUT_ROOT_CLASS = "w-fit max-w-full min-w-0";

export const PIN_INPUT_GROUP_CLASS = "flex items-center gap-small";

export const PIN_INPUT_SEPARATOR_CLASS = "select-none text-muted";

const PIN_INPUT_CELL_BOX: Record<InputSize, string> = {
  small: "w-control-small min-h-control-small",
  base: "w-control-base min-h-control-base",
  mid: "w-control-mid min-h-control-mid",
  large: "w-control-large min-h-control-large",
};

export const PIN_INPUT_DISABLED_CLASS = "cursor-not-allowed opacity-55";

/** Dots without `type="password"`, so the browser does not offer a saved password. */
export const PIN_INPUT_MASK_CLASS = "[-webkit-text-security:disc] [text-security:disc]";

export function pinInputFieldSurface(variant: InputVariant): string {
  const visual = resolveVariantVisual(variant, KIT_INPUT_VARIANTS, "pinInput.field");
  if (visual.className !== undefined) return visual.className;
  return resolveFieldShellSurfaceClass({ variant });
}

export function pinInputGroupClass({
  slotClass,
  className,
}: {
  slotClass?: string;
  className?: string;
}): string {
  return cn(PIN_INPUT_GROUP_CLASS, slotClass, className);
}

export function pinInputFieldClass({
  size,
  variant,
  status,
  disabled,
  mask,
  motionClass,
  slotClass,
  className,
}: {
  size: InputSize;
  variant: InputVariant;
  status: InputStatus;
  disabled: boolean;
  mask: boolean;
  motionClass?: string;
  slotClass?: string;
  className?: string;
}): string {
  const kitSurface = isKitVariant(variant, KIT_INPUT_VARIANTS);
  return cn(
    "box-border shrink-0 border-1 text-center text-foreground outline-none tabular-nums placeholder:text-muted",
    PIN_INPUT_CELL_BOX[size],
    CONTROL_SIZE_LAYOUT[size].rounded,
    CONTROL_SIZE_LAYOUT[size].controlPad,
    pinInputFieldSurface(variant),
    fieldShellFocusRingClass(status),
    FIELD_SHELL_TRANSITION_CLASS,
    FIELD_CONTROL_MOBILE_NO_ZOOM_CLASS,
    kitSurface && fieldShellHoverClass(!disabled, status, variant),
    motionClass,
    mask && PIN_INPUT_MASK_CLASS,
    disabled && PIN_INPUT_DISABLED_CLASS,
    slotClass,
    className,
  );
}

export function pinInputSeparatorClass({
  slotClass,
  className,
}: {
  slotClass?: string;
  className?: string;
}): string {
  return cn(PIN_INPUT_SEPARATOR_CLASS, slotClass, className);
}
