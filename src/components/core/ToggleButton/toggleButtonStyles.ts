import {
  buttonGroupRoundingClasses,
  buttonGroupSegmentSurfaceClasses,
  type ButtonGroupSegment,
} from "@/components/composite/ButtonGroup/buttonGroupSegment";
import { buttonRootClass } from "@/components/core/Button/buttonStyles";
import { hoverVariant } from "@/components/core/utils/hoverVariant";
import { GLOSS_INTERACTIVE_MOTION_CLASS } from "@/components/core/utils/glossInteractiveMotion";
import { SHADOW_LIFT_MOTION_CLASS } from "@/components/core/utils/useShadowMotion";
import { CONTROL_SIZE_LAYOUT } from "@/components/core/utils/controlSizeLayout";
import { SURFACE_COLOR_TRANSITION } from "@/components/core/utils/hoverVariant";

import { mergeToggleButtonSlotClass } from "./toggleButtonAPI";
import type { ToggleButtonSize, ToggleButtonVariant } from "./toggleButtonTypes";

const TOGGLE_BUTTON_VARIANT_IDLE: Record<ToggleButtonVariant, string> = {
  default: "border-token bg-surface text-foreground",
  outline: "bg-transparent border-token text-foreground",
  ghost: "bg-transparent border-token border-transparent text-foreground",
  gloss: "border-0 bg-transparent text-foreground",
};

export const TOGGLE_BUTTON_ROOT_BASE_CLASS =
  "group/toggle relative inline-flex origin-center items-center justify-center overflow-hidden outline-none text-foreground font-medium focus-ring";

export const TOGGLE_BUTTON_GLOSS_CLASS = "gloss-btn";

export const TOGGLE_BUTTON_PRESSED_SURFACE_CLASS = "bg-transparent";

export const TOGGLE_BUTTON_DISABLED_CLASS = "cursor-not-allowed opacity-50";

export const TOGGLE_BUTTON_ENABLED_CLASS = "cursor-pointer";

export const TOGGLE_BUTTON_FILL_BASE_CLASS =
  "pointer-events-none absolute -inset-px z-0 origin-center motion-reduce:transition-none";

export const TOGGLE_BUTTON_CONTENT_BASE_CLASS =
  "relative z-[1] inline-flex min-w-0 items-center justify-center gap-xsmall";

export const TOGGLE_BUTTON_CONTENT_GROUP_MOTION_CLASS =
  "origin-center will-change-transform";

export const TOGGLE_BUTTON_ICON_SLOT_CLASS =
  "inline-flex shrink-0 items-center justify-center [&_svg]:size-full";

export const TOGGLE_BUTTON_LABEL_CLASS = "min-w-0 shrink";

export function toggleButtonVariantIdleClass(variant: ToggleButtonVariant): string {
  return TOGGLE_BUTTON_VARIANT_IDLE[variant];
}

export function toggleButtonFillClass({
  fillColor,
  pressed,
  roundingClass,
  slotClass,
}: {
  fillColor: string;
  pressed: boolean;
  roundingClass: string;
  slotClass?: string;
}) {
  return mergeToggleButtonSlotClass(
    TOGGLE_BUTTON_FILL_BASE_CLASS,
    fillColor,
    SURFACE_COLOR_TRANSITION,
    pressed ? `group-hover/toggle:${fillColor}/80` : "group-hover/toggle:bg-default-hover",
    roundingClass,
    slotClass,
  );
}

export function toggleButtonIconClass(size: ToggleButtonSize, slotClass?: string) {
  return mergeToggleButtonSlotClass(
    TOGGLE_BUTTON_ICON_SLOT_CLASS,
    CONTROL_SIZE_LAYOUT[size].icon,
    slotClass,
  );
}

export function toggleButtonRootClass({
  variant,
  pressed,
  disabled,
  size,
  groupSegment,
  slotClass,
  className,
}: {
  variant: ToggleButtonVariant;
  pressed: boolean;
  disabled: boolean;
  size: ToggleButtonSize;
  groupSegment: ButtonGroupSegment | undefined;
  slotClass?: string;
  className?: string;
}) {
  const isGloss = variant === "gloss";
  const roundingClass = groupSegment ? buttonGroupRoundingClasses(groupSegment) : "rounded-base";
  const groupGlue = groupSegment ? buttonGroupSegmentSurfaceClasses(groupSegment) : "";

  return mergeToggleButtonSlotClass(
    TOGGLE_BUTTON_ROOT_BASE_CLASS,
    isGloss
      ? mergeToggleButtonSlotClass(
          TOGGLE_BUTTON_GLOSS_CLASS,
          !groupSegment && GLOSS_INTERACTIVE_MOTION_CLASS,
        )
      : mergeToggleButtonSlotClass(!groupSegment && SHADOW_LIFT_MOTION_CLASS),
    !isGloss && !pressed && !disabled && hoverVariant(),
    !isGloss && toggleButtonVariantIdleClass(variant),
    pressed && TOGGLE_BUTTON_PRESSED_SURFACE_CLASS,
    disabled ? TOGGLE_BUTTON_DISABLED_CLASS : TOGGLE_BUTTON_ENABLED_CLASS,
    buttonRootClass(size, true),
    roundingClass,
    groupGlue,
    slotClass,
    className,
  );
}

export function toggleButtonContentClass({
  groupSegment,
  slotClass,
}: {
  groupSegment: ButtonGroupSegment | undefined;
  slotClass?: string;
}) {
  return mergeToggleButtonSlotClass(
    TOGGLE_BUTTON_CONTENT_BASE_CLASS,
    groupSegment && TOGGLE_BUTTON_CONTENT_GROUP_MOTION_CLASS,
    slotClass,
  );
}

export function toggleButtonRoundingClass(groupSegment: ButtonGroupSegment | undefined) {
  return groupSegment ? buttonGroupRoundingClasses(groupSegment) : "rounded-base";
}
