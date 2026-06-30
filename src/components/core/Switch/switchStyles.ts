import type { CSSProperties } from "react";

import {
  optionControlCellClass,
  optionControlGridClass,
  optionErrorRow,
  optionLabelCellClass,
  optionSecondaryCellClass,
} from "@/components/core/utils/optionControlGridLayout";
import { sliderThicknessToCss } from "@/components/core/Slider";

import { mergeSwitchSlotClass } from "./switchAPI";
import { SWITCH_LAYOUT, type SwitchSize } from "./switchGeometry";
import type { SwitchLabelPosition } from "./switchTypes";

export { SWITCH_LAYOUT };

export const SWITCH_INPUT_VISUALLY_HIDDEN_CLASS =
  "absolute m-[-1px] h-px w-px overflow-hidden border-0 p-0 opacity-0 [clip:rect(0,0,0,0)]";

export const SWITCH_CONTROL_BASE_CLASS =
  "relative inline-flex shrink-0 items-center justify-center";

export const SWITCH_CONTENT_COMPOUND_CLASS = "min-w-0";

export const SWITCH_CONTENT_PASS_THROUGH_CLASS = "contents";

export const SWITCH_LABEL_CLASS = "inline-flex flex-wrap items-center gap-x-xsmall gap-y-0";

export const SWITCH_LABEL_COMPOUND_SECONDARY_CLASS = "min-w-0";

export const SWITCH_LABEL_MOTION_CLASS = "origin-center will-change-transform";

export const SWITCH_LABEL_TEXT_CLASS = "font-medium";

export const SWITCH_LABEL_TEXT_DISABLED_CLASS = "text-muted";

export const SWITCH_HINT_DISABLED_CLASS = "text-muted";

export const SWITCH_ERROR_DISABLED_CLASS = "text-muted";

export const SWITCH_SIMPLE_LABEL_WRAP_CLASS = "origin-center will-change-transform";

export const SWITCH_SIMPLE_LABEL_TEXT_CLASS = "min-w-0 font-medium";

export const SWITCH_ROOT_BASE_CLASS =
  "relative cursor-pointer select-none rounded-small text-left";

export const SWITCH_ROOT_DISABLED_CLASS = "cursor-not-allowed";

export const SWITCH_ROOT_FOCUS_CLASS =
  "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary";

export const SWITCH_ROOT_CONTROL_ONLY_CLASS = "inline-grid grid-cols-[auto] grid-rows-[auto]";

export const SWITCH_TRACK_BASE_CLASS = "relative box-border inline-flex shrink-0 rounded-full";

export const SWITCH_TRACK_GLOSS_CLASS = "gloss-indicator border-0";

export const SWITCH_TRACK_DEFAULT_CLASS = "bg-primary-tint";

export const SWITCH_FILL_BASE_CLASS = "pointer-events-none absolute inset-0 rounded-full";

export const SWITCH_FILL_GLOSS_CLASS = "z-[1]";

export const SWITCH_FILL_COLOR_CLASS = "bg-primary";

export const SWITCH_THUMB_BASE_CLASS =
  "absolute inset-y-0 left-0 aspect-square h-full w-auto will-change-transform flex";

export const SWITCH_THUMB_GLOSS_CLASS = "z-[2]";

export const SWITCH_ICON_BASE_CLASS = "absolute inset-0 flex items-center justify-center";

export function switchLabelSide(labelPosition: SwitchLabelPosition): "left" | "right" {
  return labelPosition === "left" ? "left" : "right";
}

export function switchControlCellClass(labelPosition: SwitchLabelPosition): string {
  return optionControlCellClass(switchLabelSide(labelPosition));
}

export function switchLabelCellClass(labelPosition: SwitchLabelPosition): string {
  return optionLabelCellClass(switchLabelSide(labelPosition));
}

export function switchSecondaryCellClass(
  row: 2 | 3,
  labelPosition: SwitchLabelPosition,
): string {
  return optionSecondaryCellClass(row, switchLabelSide(labelPosition));
}

export function switchErrorRow(hasHint: boolean): 2 | 3 {
  return optionErrorRow(hasHint);
}

export function switchRootGridClass({
  hasTextColumn,
  secondaryLines,
  gap,
  labelPosition,
  slotClass,
  className,
}: {
  hasTextColumn: boolean;
  secondaryLines: number;
  gap: string;
  labelPosition: SwitchLabelPosition;
  slotClass?: string;
  className?: string;
}): string {
  return mergeSwitchSlotClass(
    SWITCH_ROOT_BASE_CLASS,
    hasTextColumn
      ? optionControlGridClass(
          secondaryLines,
          gap,
          switchLabelSide(labelPosition),
          "inline-grid",
        )
      : SWITCH_ROOT_CONTROL_ONLY_CLASS,
    SWITCH_ROOT_FOCUS_CLASS,
    slotClass,
    className,
  );
}

export function switchTrackClass({
  size,
  thickness,
  gloss,
  slotClass,
  className,
}: {
  size: SwitchSize;
  thickness?: number | string;
  gloss?: boolean;
  slotClass?: string;
  className?: string;
}): string {
  return mergeSwitchSlotClass(
    SWITCH_TRACK_BASE_CLASS,
    thickness == null && SWITCH_LAYOUT[size].track,
    gloss ? SWITCH_TRACK_GLOSS_CLASS : SWITCH_TRACK_DEFAULT_CLASS,
    slotClass,
    className,
  );
}

export function switchTrackCustomStyle(thickness?: number | string): CSSProperties | undefined {
  if (thickness == null) return undefined;
  const thicknessCss = sliderThicknessToCss(thickness);
  return {
    height: thicknessCss,
    minHeight: thicknessCss,
    width: `calc(2 * (${thicknessCss}))`,
    minWidth: `calc(2 * (${thicknessCss}))`,
  };
}

export function switchFillColorStyle(color?: string): CSSProperties | undefined {
  if (!color) return undefined;
  return { background: color };
}
