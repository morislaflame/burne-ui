import type { CSSProperties } from "react";

import { SELECTION_INDICATOR_RADIUS_CLASS } from "@/components/core/SelectionIndicator/selectionIndicatorStyles";
import { optionControlCellClass, optionControlGridClass, optionErrorRow, optionLabelCellClass, optionSecondaryCellClass } from "@/components/core/utils/optionControlGridLayout";
import { sliderThicknessToCss } from "@/components/core/Slider";
import { resolveVariantVisual } from "@/skins/resolveVariantVisual";

import { SWITCH_LAYOUT, type SwitchSize } from "./switchGeometry";
import { KIT_SWITCH_VARIANTS, type SwitchLabelPosition, type SwitchVariant } from "./switchTypes";

import { cn } from "@/utils/cn";

export { SWITCH_LAYOUT };

export const SWITCH_INPUT_VISUALLY_HIDDEN_CLASS =
  "absolute m-[-1px] h-px w-px overflow-hidden border-0 p-0 opacity-0 [clip:rect(0,0,0,0)]";

export const SWITCH_CONTROL_BASE_CLASS =
  "relative inline-flex shrink-0 items-center justify-center has-focus-ring hit-target-24";

export function switchControlClass(size: SwitchSize): string {
  return cn(SWITCH_CONTROL_BASE_CLASS, SELECTION_INDICATOR_RADIUS_CLASS[size]);
}

export const SWITCH_CONTENT_COMPOUND_CLASS = "min-w-0";

export const SWITCH_CONTENT_PASS_THROUGH_CLASS = "contents";

export const SWITCH_CONTENT_POINTER_CLASS = "cursor-pointer";

export const SWITCH_COMPOUND_FIELDSET_CLASS = "m-0 min-w-0 border-0 p-0";

export const SWITCH_LABEL_CLASS = "inline-flex flex-wrap items-center gap-x-xsmall gap-y-0";

export const SWITCH_LABEL_COMPOUND_SECONDARY_CLASS = "min-w-0";

export const SWITCH_LABEL_MOTION_CLASS = "origin-center";

export const SWITCH_LABEL_TEXT_CLASS = "font-w-mid";
export const SWITCH_LABEL_TEXT_DANGER_CLASS = "text-danger";

export const SWITCH_LABEL_TEXT_DISABLED_CLASS = "text-muted";

export const SWITCH_HINT_DISABLED_CLASS = "text-muted";

export const SWITCH_ERROR_DISABLED_CLASS = "text-muted";

export const SWITCH_SIMPLE_LABEL_WRAP_CLASS = "origin-center";

export const SWITCH_SIMPLE_LABEL_TEXT_CLASS = "min-w-0 font-w-mid";

export const SWITCH_ROOT_BASE_CLASS =
  "relative cursor-pointer select-none rounded-small text-start";

export const SWITCH_ROOT_DISABLED_CLASS = "cursor-not-allowed";

export const SWITCH_ROOT_CONTROL_ONLY_CLASS = "inline-grid grid-cols-[auto] grid-rows-[auto]";

export const SWITCH_TRACK_BASE_CLASS =
  "relative box-border inline-flex shrink-0";

export const SWITCH_TRACK_DEFAULT_CLASS = "bg-primary-tint";

/** Track fill — clipped by track `overflow-hidden` (same radius as thumb). */
export const SWITCH_FILL_BASE_CLASS = "pointer-events-none absolute inset-0 rounded-[inherit]";

export const SWITCH_FILL_COLOR_CLASS = "bg-primary";

export const SWITCH_THUMB_BASE_CLASS =
  "absolute inset-y-0 start-0 aspect-square h-full w-auto flex";

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
  return cn(
    SWITCH_ROOT_BASE_CLASS,
    hasTextColumn
      ? optionControlGridClass(
          secondaryLines,
          gap,
          switchLabelSide(labelPosition),
          "inline-grid",
        )
      : SWITCH_ROOT_CONTROL_ONLY_CLASS,
    slotClass,
    className,
  );
}

export function switchTrackClass({
  size,
  thickness,
  variant = "default",
  slotClass,
  className,
}: {
  size: SwitchSize;
  thickness?: number | string;
  variant?: SwitchVariant;
  slotClass?: string;
  className?: string;
}): string {
  const visual = resolveVariantVisual(
    variant,
    KIT_SWITCH_VARIANTS,
    "selectionIndicator.root",
  );
  const surface =
    visual.className !== undefined ? visual.className : SWITCH_TRACK_DEFAULT_CLASS;

  return cn(
    SWITCH_TRACK_BASE_CLASS,
    SELECTION_INDICATOR_RADIUS_CLASS[size],
    thickness == null && SWITCH_LAYOUT[size].track,
    surface,
    slotClass,
    className,
  );
}

export function switchFillSurfaceClass(variant: SwitchVariant = "default"): string {
  const visual = resolveVariantVisual(variant, KIT_SWITCH_VARIANTS, "switch.fill");
  if (visual.className !== undefined) return visual.className;
  return SWITCH_FILL_COLOR_CLASS;
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
