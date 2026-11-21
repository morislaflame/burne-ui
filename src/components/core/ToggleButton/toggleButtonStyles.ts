import { buttonGroupOverlapBorderClasses, buttonGroupRoundingClasses, buttonGroupSegmentSurfaceClasses } from "@/components/composite/ButtonGroup/buttonGroupStyles";
import type { ButtonGroupSegment } from "@/components/composite/ButtonGroup/buttonGroupTypes";
import { buttonRootClass } from "@/components/core/Button/buttonStyles";
import { hoverVariant, type HoverVariant } from "@/components/core/utils/hoverVariant";
import { SHADOW_LIFT_MOTION_CLASS } from "@/components/core/utils/useShadowMotion";
import { CONTROL_SIZE_LAYOUT, iconSlotSizeClass } from "@/components/core/utils/sizeLayout";
import { SURFACE_COLOR_TRANSITION } from "@/components/core/utils/hoverVariant";
import type { TextVariant } from "@/components/core/Text";
import { usesKitElevation, resolveVariantVisual } from "@/skins/resolveVariantVisual";
 
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
 
const TOGGLE_BUTTON_PRESSED_FILL_HOVER_CLASS: Record<string, string> = {
  "bg-primary-tint": "group-hover/toggle:bg-primary-tint/80",
  "bg-primary": "group-hover/toggle:bg-primary/80",
  "bg-secondary": "group-hover/toggle:bg-secondary/80",
  "bg-tertiary": "group-hover/toggle:bg-tertiary/80",
  "bg-muted": "group-hover/toggle:bg-muted/80",
  "bg-surface": "group-hover/toggle:bg-surface/80",
  "bg-danger": "group-hover/toggle:bg-danger/80",
  "bg-success": "group-hover/toggle:bg-success/80",
  "bg-info": "group-hover/toggle:bg-info/80",
  "bg-warning": "group-hover/toggle:bg-warning/80",
  "bg-surface-tint-danger": "group-hover/toggle:bg-surface-tint-danger/80",
  "bg-surface-tint-success": "group-hover/toggle:bg-surface-tint-success/80",
  "bg-surface-tint-info": "group-hover/toggle:bg-surface-tint-info/80",
  "bg-surface-tint-warning": "group-hover/toggle:bg-surface-tint-warning/80",
};
 
function toggleButtonPressedFillHoverClass(fillColor: string): string {
  return TOGGLE_BUTTON_PRESSED_FILL_HOVER_CLASS[fillColor] ?? "group-hover/toggle:opacity-80";
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
  "pointer-events-none absolute inset-0 z-0 origin-center motion-reduce:transition-none";

/**
 * Clip sits on the border box (see `.toggle-fill-clip`), so inherited radius
 * meets the outer corners. A joint side has no border — stay flush there.
 */
export function toggleButtonFillClipClass(
  groupSegment: ButtonGroupSegment | undefined,
  variant: ToggleButtonVariant,
): string {
  const visual = resolveVariantVisual(variant, KIT_TOGGLE_BUTTON_VARIANTS, "toggleButton.root");
  const flush =
    groupSegment == null || groupSegment.position === "only"
      ? ""
      : groupSegment.orientation === "horizontal"
        ? groupSegment.position === "first"
          ? "toggle-fill-clip-flush-ie"
          : groupSegment.position === "last"
            ? "toggle-fill-clip-flush-is"
            : "toggle-fill-clip-flush-is toggle-fill-clip-flush-ie"
        : groupSegment.position === "first"
          ? "toggle-fill-clip-flush-be"
          : groupSegment.position === "last"
            ? "toggle-fill-clip-flush-bs"
            : "toggle-fill-clip-flush-bs toggle-fill-clip-flush-be";

  return cn(
    "toggle-fill-clip",
    visual.key === "outline" && "toggle-fill-clip-outline",
    flush,
  );
}
 
export const TOGGLE_BUTTON_CONTENT_BASE_CLASS =
  "relative z-[1] inline-flex w-full min-w-0 items-center justify-center gap-xsmall";
 
/** Marker so overlay press scales this node, not the segment shell that paints the fill. */
export const TOGGLE_BUTTON_CONTENT_GROUP_MOTION_CLASS =
  "button-group-motion origin-center";
 
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
    pressed ? toggleButtonPressedFillHoverClass(fillColor) : toggleButtonIdleFillHoverClass(visual.key),
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
  const kitSurface = usesKitElevation(variant, KIT_TOGGLE_BUTTON_VARIANTS);
  const roundingClass = groupSegment
    ? buttonGroupRoundingClasses(groupSegment)
    : CONTROL_SIZE_LAYOUT[size].rounded;
  const groupGlue = groupSegment
    ? cn(
        buttonGroupSegmentSurfaceClasses(groupSegment),
        buttonGroupOverlapBorderClasses(groupSegment),
      )
    : "";
 
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
    visual.extend,
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
