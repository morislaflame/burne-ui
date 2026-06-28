import { cn } from "@/utils/cn";

/** Position of the segment in the joined group (`Button`, `ButtonGroup.Text`, adjacent form elements in toolbars). */
export type ButtonGroupSegment = Readonly<{
  orientation: "horizontal" | "vertical";
  position: "first" | "middle" | "last" | "only";
}>;

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
