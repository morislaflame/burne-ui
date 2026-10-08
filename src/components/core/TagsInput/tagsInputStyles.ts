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

export const TAGS_INPUT_ROOT_CLASS = "w-full min-w-0";

const SHELL_MIN: Record<InputSize, string> = {
  small: "min-h-control-small",
  base: "min-h-control-base",
  mid: "min-h-control-mid",
  large: "min-h-control-large",
};

const TAG_TEXT: Record<InputSize, string> = {
  small: "text-xsmall",
  base: "text-small",
  mid: "text-base",
  large: "text-mid",
};

export function tagsInputShellSurface(variant: InputVariant): string {
  const visual = resolveVariantVisual(variant, KIT_INPUT_VARIANTS, "tagsInput.shell");
  if (visual.className !== undefined) return visual.className;
  return resolveFieldShellSurfaceClass({ variant });
}

export function tagsInputShellClass({
  size,
  variant,
  status,
  disabled,
  motionClass,
  slotClass,
  className,
}: {
  size: InputSize;
  variant: InputVariant;
  status: InputStatus;
  disabled: boolean;
  motionClass?: string;
  slotClass?: string;
  className?: string;
}): string {
  const kitSurface = isKitVariant(variant, KIT_INPUT_VARIANTS);
  return cn(
    "flex w-full min-w-0 flex-wrap items-center gap-xsmall border-1",
    SHELL_MIN[size],
    CONTROL_SIZE_LAYOUT[size].rounded,
    CONTROL_SIZE_LAYOUT[size].controlPad,
    tagsInputShellSurface(variant),
    fieldShellFocusRingClass(status),
    FIELD_SHELL_TRANSITION_CLASS,
    kitSurface && fieldShellHoverClass(!disabled, status, variant),
    motionClass,
    disabled && "cursor-not-allowed opacity-55",
    slotClass,
    className,
  );
}

/** Secondary field is already `bg-secondary`, so the chip steps up to tertiary. */
function tagsInputTagSurface(variant: InputVariant): string {
  if (variant === "secondary") return "bg-tertiary text-tertiary-foreground";
  return "bg-secondary text-secondary-foreground";
}

const TAG_PAD: Record<InputSize, string> = {
  small: "py-[length:var(--chip-py-small)]",
  base: "py-[length:var(--chip-py-base)]",
  mid: "py-[length:var(--chip-py-mid)]",
  large: "py-[length:var(--chip-py-large)]",
};

export function tagsInputTagClass(size: InputSize, variant: InputVariant, slotClass?: string): string {
  return cn(
    "inline-flex max-w-full items-center gap-xsmall rounded-full ps-small pe-xsmall",
    TAG_PAD[size],
    tagsInputTagSurface(variant),
    TAG_TEXT[size],
    slotClass,
  );
}

export function tagsInputTagTextClass(): string {
  return "min-w-0 truncate";
}

export function tagsInputRemoveClass(slotClass?: string): string {
  return cn(
    "icon-slot inline-flex size-[1em] shrink-0 items-center justify-center rounded-full p-0 text-muted focus-ring-inset",
    slotClass,
  );
}

export function tagsInputFieldClass(slotClass?: string): string {
  return cn(
    "min-w-[6rem] flex-1 border-0 bg-transparent p-0 text-foreground outline-none placeholder:text-muted",
    FIELD_CONTROL_MOBILE_NO_ZOOM_CLASS,
    slotClass,
  );
}
