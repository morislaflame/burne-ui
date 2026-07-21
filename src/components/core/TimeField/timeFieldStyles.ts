import { FIELD_SHELL_FOCUS_CLASS, FIELD_SHELL_TRANSITION_CLASS, fieldShellHoverClass } from "@/components/core/utils/useFieldShellHoverLift";
import { CONTROL_SIZE_LAYOUT } from "@/components/core/utils/controlSizeLayout";
import { FIELD_CONTROL_MOBILE_NO_ZOOM_CLASS } from "@/components/core/utils/fieldControlMobileNoZoom";
import { affixSlotClass } from "@/components/core/utils/inputAffixLayout";

import { resolveFieldShellSurfaceClass } from "@/components/core/utils/fieldShellVariant";
import type { FieldShellFilledVariant } from "@/components/core/utils/fieldShellVariant";

import type {
  TimeFieldSize,
  TimeFieldStatus,
  TimeFieldVariant,
} from "./timeFieldTypes";

import { cn } from "@/utils/cn";

function timeFieldShellHoverVariant(variant: TimeFieldVariant): FieldShellFilledVariant {
  if (variant === "segmented" || variant === "gloss") return "default";
  return variant;
}

export const TIME_FIELD_STATUS_TINT_SHELL_CLASS: Record<
  Exclude<TimeFieldStatus, "default">,
  string
> = {
  danger: "bg-surface-tint-danger",
  success: "bg-surface-tint-success",
  info: "bg-surface-tint-info",
  warning: "bg-surface-tint-warning",
};

export const TIME_FIELD_STATUS_TINT_AFFIX_CLASS: Record<
  Exclude<TimeFieldStatus, "default">,
  string
> = {
  danger: "bg-surface-tint-danger",
  success: "bg-surface-tint-success",
  info: "bg-surface-tint-info",
  warning: "bg-surface-tint-warning",
};

export const TIME_FIELD_AFFIX_SURFACE_CLASS = "bg-primary-tint";

export const TIME_FIELD_AFFIX_PREFIX_EDGE_CLASS = "border-r-token";
export const TIME_FIELD_AFFIX_SUFFIX_EDGE_CLASS = "border-l-token";

export const TIME_FIELD_KEYBOARD_INPUT_CLASS =
  `pointer-events-none absolute h-px w-px opacity-0 ${FIELD_CONTROL_MOBILE_NO_ZOOM_CLASS}`;

export const TIME_FIELD_SEGMENT_BASE_CLASS =
  "inline-flex min-w-[2ch] select-none items-center justify-center outline-none";

export const TIME_FIELD_SEGMENT_SEGMENTED_CLASS =
  "h-[1.65em] min-w-[2.25ch] rounded-small px-[3px] bg-default-hover";

export const TIME_FIELD_SEGMENT_DEFAULT_CLASS = "rounded-[3px] px-[2px]";

export const TIME_FIELD_SEGMENT_FOCUSED_CLASS = "bg-primary text-primary-foreground";

export const TIME_FIELD_SEGMENT_DISABLED_CLASS = "cursor-not-allowed";
export const TIME_FIELD_SEGMENT_ENABLED_CLASS = "cursor-default";

export const TIME_FIELD_SEGMENT_SEPARATOR_BASE_CLASS =
  "inline-flex w-[0.45em] shrink-0 select-none items-center justify-center self-center text-muted";

export const TIME_FIELD_SEGMENT_SEPARATOR_SEGMENTED_CLASS = "mx-[1px]";

export const TIME_FIELD_SEGMENT_GROUP_CLASS = "inline-flex items-center";

export const TIME_FIELD_SEGMENTS_BASE_CLASS =
  "relative flex min-w-0 flex-1 items-center font-mono tabular-nums leading-none";

/** Flex row inside `<fieldset>` — flex on fieldset itself breaks height on resize. */
export const TIME_FIELD_SHELL_INNER_CLASS =
  "flex min-w-0 w-full items-stretch";

export const TIME_FIELD_SEGMENTS_SEGMENTED_CLASS = "gap-xsmall";

const AFFIX_PADDING: Record<TimeFieldSize, string> = {
  small: affixSlotClass("small"),
  base: affixSlotClass("base"),
  mid: affixSlotClass("mid"),
  large: affixSlotClass("large"),
};

export function timeFieldAffixSurfaceClass(status: TimeFieldStatus): string {
  return status === "default"
    ? TIME_FIELD_AFFIX_SURFACE_CLASS
    : TIME_FIELD_STATUS_TINT_AFFIX_CLASS[status];
}

export function timeFieldAffixSlotClass({
  side,
  status,
  size,
  slotClass,
}: {
  side: "prefix" | "suffix";
  status: TimeFieldStatus;
  size: TimeFieldSize;
  slotClass?: string;
}) {
  return cn(
    AFFIX_PADDING[size],
    timeFieldAffixSurfaceClass(status),
    side === "prefix"
      ? TIME_FIELD_AFFIX_PREFIX_EDGE_CLASS
      : TIME_FIELD_AFFIX_SUFFIX_EDGE_CLASS,
    slotClass,
  );
}

export function timeFieldShellSurfaceClass({
  variant,
  status,
  statusTinted,
}: {
  variant: TimeFieldVariant;
  status: TimeFieldStatus;
  statusTinted: boolean;
}): string {
  return resolveFieldShellSurfaceClass({
    variant: variant === "segmented" ? "default" : variant,
    statusTinted: statusTinted && status !== "default",
    statusTintClass: status !== "default" ? TIME_FIELD_STATUS_TINT_SHELL_CLASS[status] : "",
  });
}

export function timeFieldShellClass({
  variant,
  status,
  disabled,
  compact,
  shellSurface,
  glossShellHoverMotionClass,
  standardShellHoverMotionClass,
  slotClass,
  className,
}: {
  variant: TimeFieldVariant;
  status: TimeFieldStatus;
  disabled: boolean;
  size: TimeFieldSize;
  compact: boolean;
  shellSurface: string;
  glossShellHoverMotionClass?: string;
  standardShellHoverMotionClass?: string;
  slotClass?: string;
  className?: string;
}) {
  const isGloss = variant === "gloss";

  return cn(
    "m-0 min-w-0 overflow-hidden rounded-base p-0",
    isGloss ? "relative" : cn("border-1"),
    compact ? "w-fit shrink-0" : "w-full min-w-0",
    shellSurface,
    FIELD_SHELL_TRANSITION_CLASS,
    FIELD_SHELL_FOCUS_CLASS,
    isGloss ? "" : fieldShellHoverClass(!disabled, status, timeFieldShellHoverVariant(variant)),
    isGloss ? glossShellHoverMotionClass : standardShellHoverMotionClass,
    disabled ? "cursor-not-allowed opacity-55 shadow-token-base" : "",
    slotClass,
    className,
  );
}

export function timeFieldShellInnerClass({
  variant,
}: {
  variant: TimeFieldVariant;
}): string {
  const isGloss = variant === "gloss";

  return cn(
    TIME_FIELD_SHELL_INNER_CLASS,
    !isGloss && cn("min-h-full"),
  );
}

export function timeFieldSegmentsClass({
  variant,
  size,
  compact,
  slotClass,
}: {
  variant: TimeFieldVariant;
  size: TimeFieldSize;
  compact: boolean;
  slotClass?: string;
}) {
  const layout = CONTROL_SIZE_LAYOUT[size];
  const segTextCls =
    layout.controlText === "small"
      ? "text-small"
      : layout.controlText === "mid"
        ? "text-mid"
        : "text-base";

  return cn(
    TIME_FIELD_SEGMENTS_BASE_CLASS,
    compact ? "justify-center px-small" : layout.padX,
    layout.padY,
    variant === "segmented" && TIME_FIELD_SEGMENTS_SEGMENTED_CLASS,
    segTextCls,
    slotClass,
  );
}

export function timeFieldSegmentClass({
  variant,
  focused,
  disabled,
  slotClass,
}: {
  variant: TimeFieldVariant;
  focused: boolean;
  disabled: boolean;
  slotClass?: string;
}) {
  return cn(
    TIME_FIELD_SEGMENT_BASE_CLASS,
    variant === "segmented"
      ? TIME_FIELD_SEGMENT_SEGMENTED_CLASS
      : TIME_FIELD_SEGMENT_DEFAULT_CLASS,
    focused && TIME_FIELD_SEGMENT_FOCUSED_CLASS,
    disabled ? TIME_FIELD_SEGMENT_DISABLED_CLASS : TIME_FIELD_SEGMENT_ENABLED_CLASS,
    slotClass,
  );
}

export function timeFieldSegmentSeparatorClass({
  variant,
  slotClass,
}: {
  variant: TimeFieldVariant;
  slotClass?: string;
}) {
  return cn(
    TIME_FIELD_SEGMENT_SEPARATOR_BASE_CLASS,
    variant === "segmented" && TIME_FIELD_SEGMENT_SEPARATOR_SEGMENTED_CLASS,
    slotClass,
  );
}

export function timeFieldRootClass({
  compact,
  slotClass,
  className,
}: {
  compact: boolean;
  slotClass?: string;
  className?: string;
}) {
  return cn(compact && "w-fit", slotClass, className);
}
