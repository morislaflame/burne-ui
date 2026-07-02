import type { ComponentSize } from "@/components/core/utils/componentSize";
import { CONTROL_SIZE_LAYOUT } from "@/components/core/utils/controlSizeLayout";
import type { ButtonSize, ButtonVariant } from "@/components/core/Button";
import type { TextVariant } from "@/components/core/Text";
import { cn } from "@/utils/cn";

import { mergeButtonGroupSlotClass } from "./buttonGroupAPI";
import type {
  ButtonGroupOrientation,
  ButtonGroupSegment,
} from "./buttonGroupTypes";

export const BUTTON_GROUP_TEXT_VARIANT: Record<ButtonSize, TextVariant> = {
  small: "small",
  base: "base",
  mid: "mid",
  large: "mid",
};

/** Frame for static text in ButtonGroup — alignment of the buttons height. */
export function buttonGroupTextFrameClass(size: ComponentSize): string {
  const { h, padX, padY } = CONTROL_SIZE_LAYOUT[size];
  return cn(h, padX, padY);
}

/** Ripple rounding / overflow radius — matches the button edge. */
export function buttonGroupRoundingClasses(seg: ButtonGroupSegment | undefined): string {
  if (seg == null) return "";
  const { orientation, position } = seg;
  if (position === "only") return "rounded-base";
  if (orientation === "horizontal") {
    if (position === "first") return "rounded-l-base rounded-r-none";
    if (position === "middle") return "rounded-none";
    return "rounded-r-base rounded-l-none";
  }
  if (position === "first") return "rounded-t-base rounded-b-none";
  if (position === "middle") return "rounded-none";
  return "rounded-b-base rounded-t-none";
}

function buttonGroupRoundingOverrideClasses(seg: ButtonGroupSegment): string {
  const { orientation, position } = seg;
  if (position === "only") return "!rounded-base";
  if (orientation === "horizontal") {
    if (position === "first") return "!rounded-l-base !rounded-r-none";
    if (position === "middle") return "!rounded-none";
    return "!rounded-r-base !rounded-l-none";
  }
  if (position === "first") return "!rounded-t-base !rounded-b-none";
  if (position === "middle") return "!rounded-none";
  return "!rounded-b-base !rounded-t-none";
}

/** Remove the double line at the internal joints. */
export function buttonGroupOverlapBorderClasses(
  seg: ButtonGroupSegment | undefined,
): string {
  if (seg == null || seg.position === "only") return "";
  const { orientation, position } = seg;
  if (orientation === "horizontal") {
    return position === "first" ? "" : "border-l-0";
  }
  return position === "first" ? "" : "border-t-0";
}

/** Surface of the segment inside the joined group: without its own frame. */
export function buttonGroupSegmentSurfaceClasses(seg: ButtonGroupSegment | undefined): string {
  if (seg == null) return "";
  return cn(
    buttonGroupRoundingClasses(seg),
    buttonGroupRoundingOverrideClasses(seg),
    "!border-0 [border:0!important] !shadow-none [box-shadow:none!important]",
    "z-0 focus-visible:z-[2]",
  );
}

export function buttonGroupTextSurfaceClasses(seg: ButtonGroupSegment | undefined): string {
  return cn(
    "relative inline-flex shrink-0 select-none items-center justify-center border-token bg-surface text-muted",
    buttonGroupRoundingClasses(seg),
    seg != null && buttonGroupSegmentSurfaceClasses(seg),
    "z-0",
  );
}

export function buttonGroupRootClass({
  orientation,
  segmented,
  variant,
  className,
}: {
  orientation: ButtonGroupOrientation;
  segmented: boolean;
  variant: ButtonVariant;
  className?: string;
}): string {
  return mergeButtonGroupSlotClass(
    "inline-flex text-left w-fit",
    !segmented &&
      cn(
        "relative rounded-base",
        variant === "gloss"
          ? "gloss-panel gloss-deep border-0 text-foreground"
          : "after:pointer-events-none after:absolute after:inset-0 after:rounded-base after:border-token after:content-['']",
      ),
    orientation === "horizontal"
      ? cn("flex-row flex-nowrap items-stretch", segmented && "gap-xsmall")
      : cn("flex-col flex-nowrap items-stretch", segmented && "gap-xsmall"),
    className,
  );
}

export function buttonGroupSeparatorClass(orientation: ButtonGroupOrientation): string {
  return mergeButtonGroupSlotClass(
    "pointer-events-none shrink-0",
    orientation === "horizontal"
      ? "my-[var(--border-width)] self-stretch border-r-token"
      : "mx-[var(--border-width)] self-stretch border-b-token",
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
  return mergeButtonGroupSlotClass(
    buttonGroupTextSurfaceClasses(groupSegment),
    groupVariant === "gloss" && "bg-transparent text-foreground",
    "inline-flex items-center",
    buttonGroupTextFrameClass(buttonSize),
    className,
  );
}

export const BUTTON_GROUP_TEXT_LABEL_CLASS =
  "max-w-[12rem] truncate font-w-base whitespace-nowrap md:max-w-[18rem]";
