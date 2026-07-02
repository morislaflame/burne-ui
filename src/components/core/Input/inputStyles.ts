import {
  FIELD_SHELL_FOCUS_CLASS,
  FIELD_SHELL_TRANSITION_CLASS,
  fieldShellHoverClass,
} from "@/components/core/utils/useFieldShellHoverLift";
import {
  buttonGroupRoundingClasses,
  buttonGroupSegmentSurfaceClasses,
} from "@/components/composite/ButtonGroup/buttonGroupStyles";
import type { ButtonGroupSegment } from "@/components/composite/ButtonGroup/buttonGroupTypes";
import { CONTROL_SIZE_LAYOUT } from "@/components/core/utils/controlSizeLayout";
import { affixSlotClass, affixToggleMinWClass } from "@/components/core/utils/inputAffixLayout";
import { TEXT_COLOR_TRANSITION } from "@/components/core/utils/hoverVariant";
import { hoverVariant } from "@/components/core/utils/hoverVariant";

import { mergeInputSlotClass } from "./inputAPI";
import type { InputSize, InputStatus, InputVariant } from "./inputTypes";

export const INPUT_VARIANT_SHELL_CLASS: Record<Exclude<InputVariant, "gloss">, string> = {
  default: "bg-surface",
  outline: "bg-transparent",
};

export const INPUT_STATUS_TINT_SHELL_CLASS: Record<
  Exclude<InputStatus, "default">,
  string
> = {
  danger: "bg-surface-tint-danger",
  success: "bg-surface-tint-success",
  warning: "bg-surface-tint-warning",
};

export const INPUT_STATUS_TINT_AFFIX_CLASS: Record<
  Exclude<InputStatus, "default">,
  string
> = {
  danger: "bg-surface-tint-danger",
  success: "bg-surface-tint-success",
  warning: "bg-surface-tint-warning",
};

export const INPUT_AFFIX_SURFACE_CLASS = "bg-primary-tint";

export const INPUT_SHELL_BASE_CLASS = "flex items-stretch overflow-hidden";

export const INPUT_SHELL_GLOSS_CLASS = "relative";

export const INPUT_CONTROL_BASE_CLASS =
  "min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted";

export const INPUT_FILE_INPUT_CLASS =
  "absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed";

export const INPUT_FILE_EMPTY_ICON_CLASS =
  "pointer-events-none size-12 shrink-0 text-muted";

export const INPUT_FILE_EMPTY_TEXT_CLASS =
  "pointer-events-none max-w-[18rem] text-center text-muted";

export const INPUT_FILE_PREVIEW_CLASS =
  "size-9 shrink-0 rounded-base border-token object-cover";

export const INPUT_FILE_ROW_CLASS = "flex min-w-0 items-center gap-base";

export const INPUT_FILE_ROW_SINGLE_CLASS =
  "flex h-full min-w-0 flex-1 items-center gap-base";

export const INPUT_FILE_NAME_CLASS = "min-w-0 flex-1 truncate";

export const INPUT_FILE_GLYPH_CLASS =
  "flex size-9 shrink-0 items-center justify-center rounded-base bg-surface text-muted border-token";

export const INPUT_FILE_REMOVE_CLASS =
  "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-base text-danger outline-none";

export const INPUT_PASSWORD_TOGGLE_WRAP_CLASS =
  "flex self-stretch shrink-0 items-stretch border-l-token";

export const INPUT_PASSWORD_TOGGLE_BUTTON_CLASS =
  "relative z-10 flex h-full items-center justify-center text-muted outline-none hover:text-foreground focus-ring-inset";

export const INPUT_AFFIX_PREFIX_EDGE_CLASS = "border-r-token";
export const INPUT_AFFIX_SUFFIX_EDGE_CLASS = "border-l-token";

const AFFIX_PADDING: Record<InputSize, string> = {
  small: affixSlotClass("small"),
  base: affixSlotClass("base"),
  mid: affixSlotClass("mid"),
  large: affixSlotClass("large"),
};

export const INPUT_CONTROL_PAD: Record<InputSize, string> = {
  small: CONTROL_SIZE_LAYOUT.small.controlPad,
  base: CONTROL_SIZE_LAYOUT.base.controlPad,
  mid: CONTROL_SIZE_LAYOUT.mid.controlPad,
  large: CONTROL_SIZE_LAYOUT.large.controlPad,
};

export const INPUT_SHELL_H: Record<InputSize, string> = {
  small: CONTROL_SIZE_LAYOUT.small.h,
  base: CONTROL_SIZE_LAYOUT.base.h,
  mid: CONTROL_SIZE_LAYOUT.mid.h,
  large: CONTROL_SIZE_LAYOUT.large.h,
};

export const INPUT_PASSWORD_TOGGLE_CONTROL: Record<
  InputSize,
  { icon: string; pad: string }
> = {
  small: {
    icon: CONTROL_SIZE_LAYOUT.small.toggleIcon,
    pad: CONTROL_SIZE_LAYOUT.small.togglePad,
  },
  base: {
    icon: CONTROL_SIZE_LAYOUT.base.toggleIcon,
    pad: CONTROL_SIZE_LAYOUT.base.togglePad,
  },
  mid: {
    icon: CONTROL_SIZE_LAYOUT.mid.toggleIcon,
    pad: CONTROL_SIZE_LAYOUT.mid.togglePad,
  },
  large: {
    icon: CONTROL_SIZE_LAYOUT.large.toggleIcon,
    pad: CONTROL_SIZE_LAYOUT.large.togglePad,
  },
};

export function inputAffixSurfaceClass(status: InputStatus): string {
  return status === "default"
    ? INPUT_AFFIX_SURFACE_CLASS
    : INPUT_STATUS_TINT_AFFIX_CLASS[status];
}

export function inputAffixSlotClass({
  side,
  status,
  size,
  slotClass,
}: {
  side: "prefix" | "suffix";
  status: InputStatus;
  size: InputSize;
  slotClass?: string;
}): string {
  return mergeInputSlotClass(
    AFFIX_PADDING[size],
    inputAffixSurfaceClass(status),
    side === "prefix" ? INPUT_AFFIX_PREFIX_EDGE_CLASS : INPUT_AFFIX_SUFFIX_EDGE_CLASS,
    slotClass,
  );
}

export function inputShellSurfaceClass({
  variant,
  status,
  statusTinted,
}: {
  variant: InputVariant;
  status: InputStatus;
  statusTinted: boolean;
}): string {
  if (variant === "gloss") return "gloss-control";

  if (statusTinted && status !== "default") {
    return mergeInputSlotClass(
      INPUT_STATUS_TINT_SHELL_CLASS[status],
      "border-token",
    );
  }

  return mergeInputSlotClass(
    variant === "outline"
      ? "bg-transparent border-token"
      : mergeInputSlotClass(INPUT_VARIANT_SHELL_CLASS[variant], "border-token"),
  );
}

export function inputFileEmptyShellSurfaceClass({
  variant,
  status,
  statusTinted,
}: {
  variant: InputVariant;
  status: InputStatus;
  statusTinted: boolean;
}): string {
  if (variant === "gloss") return "gloss-control";

  if (statusTinted && status !== "default") return INPUT_STATUS_TINT_SHELL_CLASS[status];

  return INPUT_VARIANT_SHELL_CLASS[variant];
}

export function inputShellRoundingClass(
  groupSegment: ButtonGroupSegment | null | undefined,
): string {
  if (groupSegment != null) {
    return mergeInputSlotClass(
      buttonGroupRoundingClasses(groupSegment),
      buttonGroupSegmentSurfaceClasses(groupSegment),
      "relative focus-within:z-[2]",
    );
  }

  return "rounded-base";
}

export function inputShellClass({
  variant,
  status,
  blocked,
  groupSegment,
  fileListEmpty,
  size,
  shellSurface,
  shellFileEmptySurface,
  shellHoverMotionClass,
  className,
  slotClass,
}: {
  variant: InputVariant;
  status: InputStatus;
  blocked: boolean;
  groupSegment: ButtonGroupSegment | null | undefined;
  fileListEmpty: boolean;
  size: InputSize;
  shellSurface: string;
  shellFileEmptySurface: string | null;
  shellHoverMotionClass: string;
  className?: string;
  slotClass?: string;
}): string {
  const isGloss = variant === "gloss";

  return mergeInputSlotClass(
    INPUT_SHELL_BASE_CLASS,
    isGloss && INPUT_SHELL_GLOSS_CLASS,
    groupSegment?.orientation === "horizontal" ? "min-w-0 flex-1" : "w-full",
    fileListEmpty
      ? "min-h-[7.25rem]"
      : mergeInputSlotClass(isGloss ? "" : "border-1", INPUT_SHELL_H[size]),
    inputShellRoundingClass(groupSegment),
    shellFileEmptySurface ?? shellSurface,
    FIELD_SHELL_TRANSITION_CLASS,
    FIELD_SHELL_FOCUS_CLASS,
    !isGloss && fieldShellHoverClass(!blocked, status),
    shellHoverMotionClass,
    blocked && "cursor-not-allowed opacity-55 shadow-token-base",
    slotClass,
    className,
  );
}

export function inputFileEmptyAreaClass(slotClass?: string): string {
  return mergeInputSlotClass(
    "relative flex min-h-[6.5rem] min-w-0 flex-1 flex-col items-center justify-center gap-plus px-large py-xlarge",
    slotClass,
  );
}

export function inputFileFilledAreaClass({
  multipleFiles,
  slotClass,
}: {
  multipleFiles: boolean;
  slotClass?: string;
}): string {
  return mergeInputSlotClass(
    "relative min-w-0 flex-1 px-large py-base",
    multipleFiles
      ? "flex flex-col gap-base"
      : "flex h-full items-center gap-plus",
    slotClass,
  );
}

export function inputPasswordToggleButtonClass({
  size,
  disabled,
  slotClass,
}: {
  size: InputSize;
  disabled?: boolean;
  slotClass?: string;
}): string {
  const pwd = INPUT_PASSWORD_TOGGLE_CONTROL[size];

  return mergeInputSlotClass(
    INPUT_PASSWORD_TOGGLE_BUTTON_CLASS,
    TEXT_COLOR_TRANSITION,
    affixToggleMinWClass(size),
    pwd.pad,
    disabled ? "cursor-not-allowed opacity-45" : "cursor-pointer",
    slotClass,
  );
}

export function inputFileRemoveButtonClass({
  disabled,
  slotClass,
}: {
  disabled?: boolean;
  slotClass?: string;
}): string {
  return mergeInputSlotClass(
    INPUT_FILE_REMOVE_CLASS,
    TEXT_COLOR_TRANSITION,
    hoverVariant("danger"),
    "focus-ring",
    disabled && "pointer-events-none opacity-40",
    slotClass,
  );
}

export { CONTROL_SIZE_LAYOUT };
