import { buttonGroupRoundingClasses, buttonGroupSegmentSurfaceClasses } from "@/components/composite/ButtonGroup/buttonGroupStyles";
import type { ButtonGroupSegment } from "@/components/composite/ButtonGroup/buttonGroupTypes";
import { buttonRootClass } from "@/components/core/Button/buttonStyles";
import { hoverVariant, type HoverVariant } from "@/components/core/utils/hoverVariant";
import { SHADOW_LIFT_MOTION_CLASS } from "@/components/core/utils/useShadowMotion";
import { CONTROL_SIZE_LAYOUT, iconSlotSizeClass } from "@/components/core/utils/sizeLayout";
import { SURFACE_COLOR_TRANSITION } from "@/components/core/utils/hoverVariant";
import type { TextVariant } from "@/components/core/Text";
import { isKitVariant, resolveVariantVisual } from "@/skins/resolveVariantVisual";
 
import type { ToggleButtonSize, ToggleButtonVariant, KitToggleButtonVariant } from "./toggleButtonTypes";
import { KIT_TOGGLE_BUTTON_VARIANTS } from "./toggleButtonTypes";
 
import { cn } from "@/utils/cn";
 
const TOGGLE_BUTTON_VARIANT_IDLE: Record<KitToggleButtonVariant, string> = {
  default: "border-token bg-surface text-foreground",
  outline: "bg-transparent border-token-outline text-foreground",
  ghost: "bg-transparent border-token border-transparent text-foreground",
};
 
function toggleButtonHoverVariant(variant: KitToggleButtonVariant): HoverVariant {
  if (variant === "outline" || variant === "ghost") return "transparent-hover";
  return "default";
}
 
function toggleButtonIdleFillHoverClass(variant: KitToggleButtonVariant): string {
  return variant === "outline" || variant === "ghost"
    ? "group-hover/toggle:bg-transparent-hover"
    : "group-hover/toggle:bg-default-hover";
}
 
export const TOGGLE_BUTTON_ROOT_BASE_CLASS =
  "group/toggle relative inline-flex origin-center items-center justify-center outline-none text-foreground focus-ring";
 
export const TOGGLE_BUTTON_PRESSED_SURFACE_CLASS = "bg-transparent";
 
export const TOGGLE_BUTTON_DISABLED_CLASS = "cursor-not-allowed opacity-50";
 
export const TOGGLE_BUTTON_ENABLED_CLASS = "cursor-pointer";
 
export const TOGGLE_BUTTON_FILL_BASE_CLASS =
  "pointer-events-none absolute -inset-px z-0 origin-center motion-reduce:transition-none";
 
export const TOGGLE_BUTTON_CONTENT_BASE_CLASS =
  "relative z-[1] inline-flex w-full min-w-0 items-center justify-center gap-xsmall";
 
export const TOGGLE_BUTTON_CONTENT_GROUP_MOTION_CLASS =
  "origin-center";
 
export const TOGGLE_BUTTON_ICON_SLOT_CLASS =
  "icon-slot inline-flex shrink-0 items-center justify-center";
 
export const TOGGLE_BUTTON_LABEL_LAYER_CLASS =
  "inline-flex w-full min-w-0 items-center gap-xsmall";
 
export const TOGGLE_BUTTON_TEXT_CLASS = "min-w-0 shrink";
 
export const TOGGLE_BUTTON_TEXT_VARIANT: Record<ToggleButtonSize, TextVariant> = {
  small: "small",
  base: "base",
  mid: "mid",
  large: "large",
};
 
export function toggleButtonLabelClass({
  slotClass,
  className,
}: {
  slotClass?: string;
  className?: string;
}): string {
  return cn(TOGGLE_BUTTON_LABEL_LAYER_CLASS, slotClass, className);
}
 
export function toggleButtonTextClass(slotClass?: string, className?: string): string {
  return cn(TOGGLE_BUTTON_TEXT_CLASS, slotClass, className);
}
 
export function toggleButtonVariantIdleClass(variant: ToggleButtonVariant): string {
  const visual = resolveVariantVisual(variant, KIT_TOGGLE_BUTTON_VARIANTS, "toggleButton.root");
  return TOGGLE_BUTTON_VARIANT_IDLE[visual.key];
}
 
export function toggleButtonFillClass({
  fillColor,
  pressed,
  variant,
  roundingClass,
  slotClass,
}: {
  fillColor: string;
  pressed: boolean;
  variant: ToggleButtonVariant;
  roundingClass: string;
  slotClass?: string;
}) {
  const visual = resolveVariantVisual(variant, KIT_TOGGLE_BUTTON_VARIANTS, "toggleButton.root");
  return cn(
    TOGGLE_BUTTON_FILL_BASE_CLASS,
    fillColor,
    SURFACE_COLOR_TRANSITION,
    pressed ? `group-hover/toggle:${fillColor}/80` : toggleButtonIdleFillHoverClass(visual.key),
    roundingClass,
    slotClass,
  );
}
 
export function toggleButtonIconClass(size: ToggleButtonSize, slotClass?: string) {
  return cn(
    TOGGLE_BUTTON_ICON_SLOT_CLASS,
    iconSlotSizeClass(size),
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
  const visual = resolveVariantVisual(variant, KIT_TOGGLE_BUTTON_VARIANTS, "toggleButton.root");
  const kitSurface = isKitVariant(variant, KIT_TOGGLE_BUTTON_VARIANTS);
  const roundingClass = groupSegment
    ? buttonGroupRoundingClasses(groupSegment)
    : CONTROL_SIZE_LAYOUT[size].rounded;
  const groupGlue = groupSegment ? buttonGroupSegmentSurfaceClasses(groupSegment) : "";
 
  if (visual.className !== undefined) {
    return cn(
      TOGGLE_BUTTON_ROOT_BASE_CLASS,
      visual.className,
      pressed && TOGGLE_BUTTON_PRESSED_SURFACE_CLASS,
      disabled ? TOGGLE_BUTTON_DISABLED_CLASS : TOGGLE_BUTTON_ENABLED_CLASS,
      buttonRootClass(size, true),
      roundingClass,
      groupGlue,
      slotClass,
      className,
    );
  }
 
  return cn(
    TOGGLE_BUTTON_ROOT_BASE_CLASS,
    kitSurface && !groupSegment && SHADOW_LIFT_MOTION_CLASS,
    !pressed && !disabled && hoverVariant(toggleButtonHoverVariant(visual.key)),
    TOGGLE_BUTTON_VARIANT_IDLE[visual.key],
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
  return cn(
    TOGGLE_BUTTON_CONTENT_BASE_CLASS,
    groupSegment && TOGGLE_BUTTON_CONTENT_GROUP_MOTION_CLASS,
    slotClass,
  );
}
 
export function toggleButtonRoundingClass(
  groupSegment: ButtonGroupSegment | undefined,
  size: ToggleButtonSize,
) {
  return groupSegment
    ? buttonGroupRoundingClasses(groupSegment)
    : CONTROL_SIZE_LAYOUT[size].rounded;
}
