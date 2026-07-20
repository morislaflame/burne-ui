import type { CSSProperties } from "react";

import { sliderThicknessToCss } from "@/components/core/Slider";
import { scaleFieldRootClassName } from "@/components/core/utils/scaleFieldRootClassName";

import type { MeterOrientation, MeterSize } from "./meterTypes";

import { cn } from "@/utils/cn";

export const METER_RAIL_HEIGHT_CLASS: Record<MeterSize, string> = {
  small: "h-small",
  base: "h-base",
  mid: "h-plus",
  large: "h-mid",
};

export const METER_RAIL_WIDTH_CLASS: Record<MeterSize, string> = {
  small: "w-small",
  base: "w-base",
  mid: "w-plus",
  large: "w-mid",
};

export const METER_TRACK_BASE_CLASS =
  "relative overflow-hidden rounded-full bg-primary-tint";

export const METER_TRACK_HORIZONTAL_CLASS = "w-full";

export const METER_TRACK_VERTICAL_CLASS = "h-48";

export const METER_FILL_BASE_CLASS = "absolute rounded-full";

export const METER_FILL_HORIZONTAL_CLASS = "inset-y-0 left-0";

export const METER_FILL_VERTICAL_CLASS = "inset-x-0 bottom-0";

export const METER_FILL_DEFAULT_COLOR_CLASS = "bg-primary";

export const METER_HEADER_BASE_CLASS =
  "flex items-baseline justify-between gap-xsmall";

export const METER_HEADER_HORIZONTAL_CLASS = "w-full";

export const METER_HEADER_VERTICAL_CLASS = "min-w-[8rem]";

export const METER_VALUE_CLASS = "tabular-nums text-muted";

export function meterRootClass({
  orientation,
  slotClass,
  className,
}: {
  orientation: MeterOrientation;
  slotClass?: string;
  className?: string;
}): string {
  return cn(
    scaleFieldRootClassName(orientation),
    slotClass,
    className,
  );
}

export function meterHeaderClass({
  orientation,
  slotClass,
  className,
}: {
  orientation: MeterOrientation;
  slotClass?: string;
  className?: string;
}): string {
  return cn(
    METER_HEADER_BASE_CLASS,
    orientation === "horizontal"
      ? METER_HEADER_HORIZONTAL_CLASS
      : METER_HEADER_VERTICAL_CLASS,
    slotClass,
    className,
  );
}

export function meterValueClass({
  slotClass,
  className,
}: {
  slotClass?: string;
  className?: string;
}): string {
  return cn(METER_VALUE_CLASS, slotClass, className);
}

export function meterTrackClass({
  isHorizontal,
  size,
  thickness,
  slotClass,
  className,
}: {
  isHorizontal: boolean;
  size: MeterSize;
  thickness?: number | string;
  slotClass?: string;
  className?: string;
}): string {
  return cn(
    METER_TRACK_BASE_CLASS,
    isHorizontal ? METER_TRACK_HORIZONTAL_CLASS : METER_TRACK_VERTICAL_CLASS,
    thickness == null &&
      (isHorizontal ? METER_RAIL_HEIGHT_CLASS[size] : METER_RAIL_WIDTH_CLASS[size]),
    slotClass,
    className,
  );
}

export function meterFillClass({
  isHorizontal,
  hasCustomColor,
  slotClass,
}: {
  isHorizontal: boolean;
  hasCustomColor: boolean;
  slotClass?: string;
}): string {
  return cn(
    METER_FILL_BASE_CLASS,
    isHorizontal ? METER_FILL_HORIZONTAL_CLASS : METER_FILL_VERTICAL_CLASS,
    !hasCustomColor && METER_FILL_DEFAULT_COLOR_CLASS,
    slotClass,
  );
}

export function meterTrackCrossStyle({
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

export function meterFillColorStyle(color?: string): CSSProperties | undefined {
  if (!color) return undefined;
  return { background: color };
}

export function meterFillTargetStyle({
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

export function meterFillInitialStyle({
  isHorizontal,
  percent,
  fillColorStyle,
}: {
  isHorizontal: boolean;
  percent: number;
  fillColorStyle?: CSSProperties;
}): CSSProperties {
  return {
    width: isHorizontal ? `${percent}%` : "100%",
    height: isHorizontal ? "100%" : `${percent}%`,
    ...fillColorStyle,
  };
}
