import type { CSSProperties } from "react";

import { sliderThicknessToCss } from "@/components/core/Slider";
import { scaleFieldRootClassName } from "@/components/core/utils/scaleFieldRootClassName";

import { mergeProgressBarSlotClass } from "./progressBarAPI";
import type { ProgressBarOrientation, ProgressBarSize } from "./progressBarTypes";

export const PROGRESS_BAR_RAIL_HEIGHT_CLASS: Record<ProgressBarSize, string> = {
  small: "h-small",
  base: "h-base",
  mid: "h-plus",
  large: "h-mid",
};

export const PROGRESS_BAR_RAIL_WIDTH_CLASS: Record<ProgressBarSize, string> = {
  small: "w-small",
  base: "w-base",
  mid: "w-plus",
  large: "w-mid",
};

export const PROGRESS_BAR_TRACK_BASE_CLASS =
  "relative overflow-hidden rounded-full bg-primary-tint";

export const PROGRESS_BAR_TRACK_HORIZONTAL_CLASS = "w-full";

export const PROGRESS_BAR_TRACK_VERTICAL_CLASS = "h-48";

export const PROGRESS_BAR_FILL_BASE_CLASS = "absolute rounded-full";

export const PROGRESS_BAR_FILL_HORIZONTAL_CLASS = "inset-y-0 left-0";

export const PROGRESS_BAR_FILL_VERTICAL_CLASS = "inset-x-0 bottom-0";

export const PROGRESS_BAR_FILL_DEFAULT_COLOR_CLASS = "bg-primary";

export const PROGRESS_BAR_INDETERMINATE_FILL_BASE_CLASS =
  "absolute rounded-full will-change-transform";

export const PROGRESS_BAR_INDETERMINATE_FILL_HORIZONTAL_CLASS =
  "inset-y-0 left-0 w-1/4";

export const PROGRESS_BAR_INDETERMINATE_FILL_VERTICAL_CLASS =
  "inset-x-0 bottom-0 h-1/4";

export const PROGRESS_BAR_INDETERMINATE_FILL_REDUCED_HORIZONTAL_CLASS =
  "left-1/4 w-1/2";

export const PROGRESS_BAR_INDETERMINATE_FILL_REDUCED_VERTICAL_CLASS =
  "bottom-1/4 h-1/2";

export const PROGRESS_BAR_HEADER_BASE_CLASS =
  "flex items-baseline justify-between gap-xsmall";

export const PROGRESS_BAR_HEADER_HORIZONTAL_CLASS = "w-full";

export const PROGRESS_BAR_HEADER_VERTICAL_CLASS = "min-w-[8rem]";

export const PROGRESS_BAR_VALUE_CLASS = "tabular-nums text-muted";

export function progressBarRootClass({
  orientation,
  slotClass,
  className,
}: {
  orientation: ProgressBarOrientation;
  slotClass?: string;
  className?: string;
}): string {
  return mergeProgressBarSlotClass(
    scaleFieldRootClassName(orientation),
    slotClass,
    className,
  );
}

export function progressBarHeaderClass({
  orientation,
  slotClass,
  className,
}: {
  orientation: ProgressBarOrientation;
  slotClass?: string;
  className?: string;
}): string {
  return mergeProgressBarSlotClass(
    PROGRESS_BAR_HEADER_BASE_CLASS,
    orientation === "horizontal"
      ? PROGRESS_BAR_HEADER_HORIZONTAL_CLASS
      : PROGRESS_BAR_HEADER_VERTICAL_CLASS,
    slotClass,
    className,
  );
}

export function progressBarValueClass({
  slotClass,
  className,
}: {
  slotClass?: string;
  className?: string;
}): string {
  return mergeProgressBarSlotClass(PROGRESS_BAR_VALUE_CLASS, slotClass, className);
}

export function progressBarTrackClass({
  isHorizontal,
  size,
  thickness,
  slotClass,
  className,
}: {
  isHorizontal: boolean;
  size: ProgressBarSize;
  thickness?: number | string;
  slotClass?: string;
  className?: string;
}): string {
  return mergeProgressBarSlotClass(
    PROGRESS_BAR_TRACK_BASE_CLASS,
    isHorizontal
      ? PROGRESS_BAR_TRACK_HORIZONTAL_CLASS
      : PROGRESS_BAR_TRACK_VERTICAL_CLASS,
    thickness == null &&
      (isHorizontal
        ? PROGRESS_BAR_RAIL_HEIGHT_CLASS[size]
        : PROGRESS_BAR_RAIL_WIDTH_CLASS[size]),
    slotClass,
    className,
  );
}

export function progressBarFillClass({
  isHorizontal,
  hasCustomColor,
  slotClass,
}: {
  isHorizontal: boolean;
  hasCustomColor: boolean;
  slotClass?: string;
}): string {
  return mergeProgressBarSlotClass(
    PROGRESS_BAR_FILL_BASE_CLASS,
    isHorizontal
      ? PROGRESS_BAR_FILL_HORIZONTAL_CLASS
      : PROGRESS_BAR_FILL_VERTICAL_CLASS,
    !hasCustomColor && PROGRESS_BAR_FILL_DEFAULT_COLOR_CLASS,
    slotClass,
  );
}

export function progressBarIndeterminateFillClass({
  isHorizontal,
  hasCustomColor,
  reduceMotion,
  slotClass,
}: {
  isHorizontal: boolean;
  hasCustomColor: boolean;
  reduceMotion: boolean;
  slotClass?: string;
}): string {
  return mergeProgressBarSlotClass(
    PROGRESS_BAR_INDETERMINATE_FILL_BASE_CLASS,
    isHorizontal
      ? PROGRESS_BAR_INDETERMINATE_FILL_HORIZONTAL_CLASS
      : PROGRESS_BAR_INDETERMINATE_FILL_VERTICAL_CLASS,
    !hasCustomColor && PROGRESS_BAR_FILL_DEFAULT_COLOR_CLASS,
    reduceMotion &&
      (isHorizontal
        ? PROGRESS_BAR_INDETERMINATE_FILL_REDUCED_HORIZONTAL_CLASS
        : PROGRESS_BAR_INDETERMINATE_FILL_REDUCED_VERTICAL_CLASS),
    slotClass,
  );
}

export function progressBarTrackCrossStyle({
  isHorizontal,
  thickness,
}: {
  isHorizontal: boolean;
  thickness?: number | string;
}): CSSProperties | undefined {
  if (thickness == null) return undefined;
  const thicknessCss = sliderThicknessToCss(thickness);
  return isHorizontal ? { height: thicknessCss } : { width: thicknessCss };
}

export function progressBarFillColorStyle(color?: string): CSSProperties | undefined {
  if (!color) return undefined;
  return { background: color };
}

export function progressBarFillTargetStyle({
  isHorizontal,
  percent,
}: {
  isHorizontal: boolean;
  percent: number;
}): CSSProperties {
  if (isHorizontal) {
    return { width: `${percent}%`, height: "100%" };
  }
  return { width: "100%", height: `${percent}%` };
}

export function progressBarDeterminateFillStyle({
  isHorizontal,
  fillColorStyle,
}: {
  isHorizontal: boolean;
  fillColorStyle?: CSSProperties;
}): CSSProperties {
  return {
    ...(isHorizontal ? { height: "100%" } : { width: "100%" }),
    ...fillColorStyle,
  };
}
