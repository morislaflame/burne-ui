import { optionControlCellClass, optionControlGridClass, optionErrorRow, optionLabelCellClass, optionSecondaryCellClass } from "@/components/core/utils/optionControlGridLayout";
import { OPTION_CONTROL_SIZE_LAYOUT } from "@/components/core/utils/sizeLayout";
import { cn } from "@/utils/cn";

export const CHECKBOX_SIZE_LAYOUT = OPTION_CONTROL_SIZE_LAYOUT;

export const CHECKBOX_INPUT_VISUALLY_HIDDEN_CLASS =
  "absolute m-[-1px] h-px w-px overflow-hidden border-0 p-0 opacity-0 [clip:rect(0,0,0,0)]";

export const CHECKBOX_INPUT_TRACK_OVERLAY_CLASS =
  "absolute inset-0 z-[2] m-0 h-full w-full cursor-pointer opacity-0";

export const CHECKBOX_CONTROL_CLASS =
  "relative inline-flex shrink-0 items-center justify-center";

export const CHECKBOX_CONTROL_TRACK_CLASS =
  "relative inline-flex items-center justify-center";

export const CHECKBOX_CONTENT_COMPOUND_CLASS = "min-w-0";

export const CHECKBOX_CONTENT_POINTER_CLASS = "cursor-pointer";

export const CHECKBOX_LABEL_CLASS = "inline-flex flex-wrap items-center gap-x-xsmall gap-y-0 font-w-mid";

export const CHECKBOX_LABEL_COMPOUND_SECONDARY_CLASS = "min-w-0";

export const CHECKBOX_LABEL_MOTION_CLASS = "origin-center will-change-transform";

export const CHECKBOX_LABEL_TEXT_DISABLED_CLASS = "text-muted";

export const CHECKBOX_LABEL_TEXT_DANGER_CLASS = "text-danger";

export const CHECKBOX_REQUIRED_MARK_CLASS = "text-danger";

export const CHECKBOX_HINT_DISABLED_CLASS = "text-muted";

export const CHECKBOX_ERROR_DISABLED_CLASS = "text-muted";

export const CHECKBOX_SIMPLE_LABEL_WRAP_CLASS = "origin-center will-change-transform";

export const CHECKBOX_SIMPLE_LABEL_TEXT_CLASS = "min-w-0 font-w-mid";

export const CHECKBOX_ROOT_BASE_CLASS =
  "relative cursor-pointer select-none rounded-small text-left";

export const CHECKBOX_ROOT_DISABLED_CLASS = "cursor-not-allowed";

export const CHECKBOX_ROOT_FOCUS_CLASS =
  "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary";

export const CHECKBOX_COMPOUND_FIELDSET_CLASS = "m-0 min-w-0 border-0 p-0";

export const CHECKBOX_CONTENT_PASS_THROUGH_CLASS = "contents";

export function checkboxControlCellClass(): string {
  return optionControlCellClass();
}

export function checkboxGridClass(
  secondaryLines: number,
  gridGap: string,
  className?: string,
): string {
  return cn(
    CHECKBOX_ROOT_BASE_CLASS,
    optionControlGridClass(secondaryLines, gridGap),
    CHECKBOX_ROOT_FOCUS_CLASS,
    className,
  );
}

export function checkboxLabelCellClass(): string {
  return optionLabelCellClass();
}

export function checkboxSecondaryCellClass(row: 2 | 3): string {
  return optionSecondaryCellClass(row);
}

export function checkboxErrorRow(hasHint: boolean): 2 | 3 {
  return optionErrorRow(hasHint);
}
