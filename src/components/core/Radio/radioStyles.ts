import { optionControlCellClass, optionControlGridClass, optionErrorRow, optionLabelCellClass, optionSecondaryCellClass } from "@/components/core/utils/optionControlGridLayout";
import { OPTION_CONTROL_SIZE_LAYOUT } from "@/components/core/utils/optionControlSizeLayout";
import { cn } from "@/utils/cn";

export const RADIO_SIZE_LAYOUT = OPTION_CONTROL_SIZE_LAYOUT;

export const RADIO_INPUT_VISUALLY_HIDDEN_CLASS =
  "absolute m-[-1px] h-px w-px overflow-hidden border-0 p-0 opacity-0 [clip:rect(0,0,0,0)]";

export const RADIO_CONTROL_CLASS =
  "relative inline-flex shrink-0 items-center justify-center";

export const RADIO_CONTROL_TRACK_CLASS =
  "relative inline-flex items-center justify-center";

export const RADIO_CONTENT_COMPOUND_CLASS = "min-w-0";

export const RADIO_LABEL_CLASS = "inline-flex flex-wrap items-center gap-x-xsmall gap-y-0";

export const RADIO_LABEL_COMPOUND_SECONDARY_CLASS = "min-w-0";

export const RADIO_LABEL_MOTION_CLASS = "origin-center will-change-transform";

export const RADIO_LABEL_TEXT_DISABLED_CLASS = "text-muted";

export const RADIO_LABEL_TEXT_DANGER_CLASS = "text-danger";

export const RADIO_REQUIRED_MARK_CLASS = "text-danger";

export const RADIO_HINT_DISABLED_CLASS = "text-muted";

export const RADIO_ERROR_DISABLED_CLASS = "text-muted";

export const RADIO_SIMPLE_LABEL_WRAP_CLASS = "origin-center will-change-transform";

export const RADIO_SIMPLE_LABEL_TEXT_CLASS = "min-w-0";

export const RADIO_ROOT_BASE_CLASS =
  "relative cursor-pointer select-none rounded-small text-left";

export const RADIO_ROOT_DISABLED_CLASS = "cursor-not-allowed";

export const RADIO_ROOT_FOCUS_CLASS =
  "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary";

export const RADIO_CONTENT_PASS_THROUGH_CLASS = "contents";

export function radioControlCellClass(): string {
  return optionControlCellClass();
}

export function radioGridClass(
  secondaryLines: number,
  gridGap: string,
  className?: string,
): string {
  return cn(
    RADIO_ROOT_BASE_CLASS,
    optionControlGridClass(secondaryLines, gridGap),
    RADIO_ROOT_FOCUS_CLASS,
    className,
  );
}

export function radioLabelCellClass(): string {
  return optionLabelCellClass();
}

export function radioSecondaryCellClass(row: 2 | 3): string {
  return optionSecondaryCellClass(row);
}

export function radioErrorRow(hasHint: boolean): 2 | 3 {
  return optionErrorRow(hasHint);
}
