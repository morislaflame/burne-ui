import type { ComponentSize } from "@/components/core/utils/sizeLayout";
import { CONTROL_SIZE_LAYOUT } from "@/components/core/utils/sizeLayout";
import type { ButtonSize, ButtonVariant } from "@/components/core/Button";
import { KIT_BUTTON_VARIANTS } from "@/components/core/Button/buttonTypes";
import type { TextVariant } from "@/components/core/Text";
import { isKitVariant, resolveVariantVisual } from "@/skins/resolveVariantVisual";
import type { SkinSlot } from "@/skins/skinTypes";
import { cn } from "@/utils/cn";
 
import type {
  ButtonGroupOrientation,
  ButtonGroupSegment,
} from "./buttonGroupTypes";
 
export const BUTTON_GROUP_TEXT_VARIANT: Record<ButtonSize, TextVariant> = {
  small: "small",
  base: "base",
  mid: "mid",
  large: "large",
};
 
const BUTTON_GROUP_CONTROL_HEIGHT_CLASS: Record<ComponentSize, string> = {
  small: "min-h-control-small",
  base: "min-h-control-base",
  mid: "min-h-control-mid",
  large: "min-h-control-large",
};
 
/** Frame for static text in ButtonGroup — alignment of the buttons height. */
export function buttonGroupTextFrameClass(size: ComponentSize): string {
  const { padX, padY } = CONTROL_SIZE_LAYOUT[size];
  return cn(BUTTON_GROUP_CONTROL_HEIGHT_CLASS[size], padX, padY);
}
 
/**
 * Ripple / segment corner radius — inherits from ButtonGroup root so
 * `classNames.root` / `rounded-*` on the group retargets corners + frame (::after).
 * No `!` — consumer `className` must be able to override via `cn` / twMerge.
 */
export function buttonGroupRoundingClasses(seg: ButtonGroupSegment | undefined): string {
  if (seg == null) return "";
  const { orientation, position } = seg;
  if (position === "only") return "rounded-[inherit]";
  if (orientation === "horizontal") {
    if (position === "first") return "rounded-s-[inherit] rounded-e-none";
    if (position === "middle") return "rounded-none";
    return "rounded-e-[inherit] rounded-s-none";
  }
  if (position === "first") return "rounded-t-[inherit] rounded-b-none";
  if (position === "middle") return "rounded-none";
  return "rounded-b-[inherit] rounded-t-none";
}
 
/**
 * Outer shell for wrappers between ButtonGroup and the rounded segment
 * (Dropdown root, ComboBox/Select `Field`) so `rounded-*- [inherit]` resolves.
 */
export const BUTTON_GROUP_RADIUS_BRIDGE_CLASS =
  "min-h-0 min-w-0 self-stretch rounded-[inherit]";
 
/** Remove the double line at the internal joints. */
export function buttonGroupOverlapBorderClasses(
  seg: ButtonGroupSegment | undefined,
): string {
  if (seg == null || seg.position === "only") return "";
  const { orientation, position } = seg;
  if (orientation === "horizontal") {
    return position === "first" ? "" : "border-s-0";
  }
  return position === "first" ? "" : "border-t-0";
}
 
/** Surface of the segment inside the joined group: without its own frame. */
export function buttonGroupSegmentSurfaceClasses(seg: ButtonGroupSegment | undefined): string {
  if (seg == null) return "";
  return cn("button-group-segment", "z-0 focus-visible:z-[2]");
}
 
export function buttonGroupTextSurfaceClasses(seg: ButtonGroupSegment | undefined): string {
  return cn(
    "relative inline-flex shrink-0 select-none items-center justify-center border-token bg-surface text-muted",
    buttonGroupRoundingClasses(seg),
    seg != null && buttonGroupSegmentSurfaceClasses(seg),
    "z-0",
  );
}
 
/** Shrink-wrapped cluster: inline flex, text follows writing direction. */
export const BUTTON_GROUP_ROOT_LAYOUT_CLASS = "inline-flex text-start w-fit";
 
export function buttonGroupRootClass({
  orientation,
  segmented,
  variant,
  className,
  kitVariants = KIT_BUTTON_VARIANTS,
  skinSlot = "buttonGroup.root",
}: {
  orientation: ButtonGroupOrientation;
  segmented: boolean;
  variant: string;
  className?: string;
  kitVariants?: readonly string[];
  skinSlot?: SkinSlot;
}): string {
  const visual = resolveVariantVisual(variant, kitVariants, skinSlot);
  return cn(
    BUTTON_GROUP_ROOT_LAYOUT_CLASS,
    !segmented &&
      cn(
        // Frame lives on ::after (keeps separators / focus paint clean). Radius +
        // border-color come from the root so `rounded-*` / `border-primary` on
        // classNames.root retarget the visible frame without `after:*` overrides.
        "relative rounded-base border-border",
        visual.className !== undefined
          ? visual.className
          : "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:border-solid after:[border-width:var(--border-width,1px)] after:border-inherit after:content-['']",
      ),
    orientation === "horizontal"
      ? cn("flex-row flex-nowrap items-stretch", segmented && "gap-xsmall")
      : cn("flex-col flex-nowrap items-stretch", segmented && "gap-xsmall"),
    className,
  );
}
 
export function buttonGroupSeparatorClass(
  orientation: ButtonGroupOrientation,
  className?: string,
): string {
  return cn(
    "pointer-events-none shrink-0",
    orientation === "horizontal"
      ? "my-[var(--border-width)] self-stretch border-e-token"
      : "mx-[var(--border-width)] self-stretch border-b-token",
    className,
  );
}
 
export function buttonGroupTextClass({
  groupSegment,
  groupVariant,
  buttonSize,
  className,
}: {
  groupSegment: ButtonGroupSegment | undefined;
  groupVariant: ButtonVariant | undefined;
  buttonSize: ButtonSize;
  className?: string;
}): string {
  return cn(
    buttonGroupTextSurfaceClasses(groupSegment),
    groupVariant != null &&
      !isKitVariant(groupVariant, KIT_BUTTON_VARIANTS) &&
      "bg-transparent text-foreground",
    "inline-flex items-center",
    buttonGroupTextFrameClass(buttonSize),
    className,
  );
}
 
export const BUTTON_GROUP_TEXT_LABEL_CLASS =
  "max-w-component-xsmall truncate font-w-base whitespace-nowrap md:max-w-component-base";
 