import { CONTROL_SIZE_LAYOUT } from "@/components/core/utils/sizeLayout";
import { FIELD_CONTROL_MOBILE_NO_ZOOM_CLASS } from "@/components/core/utils/fieldControlMobileNoZoom";
import { resolveFieldShellSurfaceClass } from "@/components/core/utils/fieldShellVariant";
import { iconSlotClass, type IconSlotStep } from "@/components/core/utils/sizeLayout/iconSlot";
import { TEXT_COLOR_TRANSITION } from "@/components/core/utils/hoverVariant";
import {
  FIELD_SHELL_TRANSITION_CLASS,
  fieldShellFocusRingClass,
  fieldShellHoverClass,
} from "@/components/core/utils/useFieldShellHoverLift";
import { KIT_INPUT_VARIANTS, type InputSize, type InputStatus, type InputVariant } from "@/components/core/Input/inputTypes";
import { isKitVariant, resolveVariantVisual } from "@/skins/resolveVariantVisual";
import { cn } from "@/utils/cn";

export const NUMBER_INPUT_ROOT_CLASS = "w-fit max-w-full min-w-0";

export const NUMBER_INPUT_SHELL_MIN: Record<InputSize, string> = {
  small: "min-h-control-small",
  base: "min-h-control-base",
  mid: "min-h-control-mid",
  large: "min-h-control-large",
};

const NUMBER_INPUT_CONTROL_MIN: Record<InputSize, string> = {
  small: "min-w-button-small",
  base: "min-w-button-base",
  mid: "min-w-button-mid",
  large: "min-w-button-large",
};

const NUMBER_INPUT_BUTTON_PAD: Record<InputSize, string> = {
  small: "px-xsmall",
  base: "px-small",
  mid: "px-base",
  large: "px-base",
};

const NUMBER_INPUT_ICON_STEP: Record<InputSize, IconSlotStep> = {
  small: "small",
  base: "base",
  mid: "mid",
  large: "large",
};

export const NUMBER_INPUT_SHELL_DISABLED_CLASS = "cursor-not-allowed opacity-55 shadow-token-base";

export function numberInputIconClass(size: InputSize): string {
  return iconSlotClass(NUMBER_INPUT_ICON_STEP[size]);
}

export function numberInputShellSurface(variant: InputVariant): string {
  const visual = resolveVariantVisual(variant, KIT_INPUT_VARIANTS, "numberInput.shell");
  if (visual.className !== undefined) return visual.className;
  return resolveFieldShellSurfaceClass({ variant });
}

export function numberInputShellClass({
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
    "relative flex w-full min-w-0 items-stretch overflow-hidden rounded-base border-1",
    NUMBER_INPUT_SHELL_MIN[size],
    numberInputShellSurface(variant),
    fieldShellFocusRingClass(status),
    FIELD_SHELL_TRANSITION_CLASS,
    kitSurface && fieldShellHoverClass(!disabled, status, variant),
    shellHoverMotionClass,
    disabled && NUMBER_INPUT_SHELL_DISABLED_CLASS,
    slotClass,
    className,
  );
}

export function numberInputControlClass({
  size,
  slotClass,
  className,
}: {
  size: InputSize;
  slotClass?: string;
  className?: string;
}): string {
  return cn(
    "min-w-0 flex-1 bg-transparent text-center text-foreground outline-none placeholder:text-muted tabular-nums",
    CONTROL_SIZE_LAYOUT[size].controlPad,
    NUMBER_INPUT_CONTROL_MIN[size],
    FIELD_CONTROL_MOBILE_NO_ZOOM_CLASS,
    slotClass,
    className,
  );
}

export function numberInputStepperClass({
  size,
  side,
  disabled,
  slotClass,
  className,
}: {
  size: InputSize;
  side: "decrement" | "increment";
  disabled: boolean;
  slotClass?: string;
  className?: string;
}): string {
  return cn(
    "relative z-10 flex shrink-0 items-center justify-center text-muted outline-none focus-ring-inset",
    TEXT_COLOR_TRANSITION,
    NUMBER_INPUT_BUTTON_PAD[size],
    side === "decrement" ? "border-e-token" : "border-s-token",
    disabled ? "cursor-not-allowed opacity-45" : "cursor-pointer hover:text-foreground",
    slotClass,
    className,
  );
}
