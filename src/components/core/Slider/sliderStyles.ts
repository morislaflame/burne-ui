import type { CSSProperties } from "react";

import { SELECTION_INDICATOR_RADIUS_CLASS } from "@/components/core/SelectionIndicator/selectionIndicatorStyles";
import { scaleFieldRootClassName } from "@/components/core/utils/scaleFieldRootClassName";
import { isKitVariant, resolveVariantVisual } from "@/skins/resolveVariantVisual";

import {
  KIT_SLIDER_VARIANTS,
  type SliderOrientation,
  type SliderSize,
  type SliderVariant,
} from "./sliderTypes";

import { cn } from "@/utils/cn";

export function sliderThicknessToCss(thickness: number | string): string {
  return typeof thickness === "number" ? `${thickness}px` : thickness;
}

export const SLIDER_SCALE_HEADER_BASE_CLASS = "flex items-baseline justify-between gap-xsmall";

export const SLIDER_SCALE_HEADER_HORIZONTAL_CLASS = "w-full";

export const SLIDER_SCALE_HEADER_VERTICAL_CLASS = "min-w-[8rem]";

export const SLIDER_SCALE_VALUE_CLASS = "tabular-nums text-muted";

export const SLIDER_RAIL_HEIGHT: Record<SliderSize, string> = {
  small: "h-[var(--selection-indicator-small)] min-h-[var(--selection-indicator-small)]",
  base: "h-[var(--selection-indicator-base)] min-h-[var(--selection-indicator-base)]",
  mid: "h-[var(--selection-indicator-mid)] min-h-[var(--selection-indicator-mid)]",
  large: "h-[var(--selection-indicator-large)] min-h-[var(--selection-indicator-large)]",
};

export const SLIDER_RAIL_WIDTH: Record<SliderSize, string> = {
  small: "w-[var(--selection-indicator-small)] min-w-[var(--selection-indicator-small)]",
  base: "w-[var(--selection-indicator-base)] min-w-[var(--selection-indicator-base)]",
  mid: "w-[var(--selection-indicator-mid)] min-w-[var(--selection-indicator-mid)]",
  large: "w-[var(--selection-indicator-large)] min-w-[var(--selection-indicator-large)]",
};

export const SLIDER_RAIL_LAYOUT_CLASS =
  "pointer-events-none absolute inset-0 overflow-hidden";

export const SLIDER_RAIL_DEFAULT_CLASS = "bg-primary-tint";

export const SLIDER_RAIL_DISABLED_CLASS = "opacity-48";

export const SLIDER_RAIL_SKIN_SHAPE_CLASS = "overflow-hidden";

/** Rail fill — clipped by rail `overflow-hidden` (same radius as thumb). */
export const SLIDER_FILL_LAYOUT_CLASS = "absolute rounded-[inherit]";

export const SLIDER_FILL_DEFAULT_CLASS = "bg-primary";

export const SLIDER_FILL_HORIZONTAL_CLASS = "inset-y-0";

export const SLIDER_FILL_VERTICAL_CLASS = "inset-x-0";

export const SLIDER_TRACK_HIT_BASE_CLASS = "relative touch-none select-none";

export const SLIDER_TRACK_HIT_HORIZONTAL_CLASS = "w-full";

export const SLIDER_TRACK_HIT_VERTICAL_CLASS = "h-48";

export const SLIDER_MARK_CLASS =
  "pointer-events-none absolute z-[1] size-1 rounded-[var(--selection-indicator-radius-xsmall)] bg-primary/30";

export const SLIDER_THUMB_BUTTON_BASE_CLASS =
  "absolute box-border flex shrink-0 origin-center items-center justify-center m-0 appearance-none border-0 bg-transparent p-0 focus-ring";

export const SLIDER_THUMB_BUTTON_HORIZONTAL_CLASS =
  "top-0 h-full w-auto -translate-x-1/2 aspect-square";

export const SLIDER_THUMB_BUTTON_VERTICAL_CLASS =
  "start-0 w-full h-auto -translate-y-1/2 aspect-square";

export const SLIDER_THUMB_BUTTON_DISABLED_CLASS = "cursor-not-allowed";

export const SLIDER_THUMB_BUTTON_ENABLED_CLASS = "cursor-grab active:cursor-grabbing";

export const SLIDER_THUMB_BUTTON_Z_CLASS = "z-[2]";

export const SLIDER_THUMB_BUTTON_Z_ACTIVE_CLASS = "z-[3]";

export const SLIDER_LABEL_DANGER_CLASS = "text-danger";

export function sliderRootClass({
  orientation,
  slotClass,
  className,
}: {
  orientation: SliderOrientation;
  slotClass?: string;
  className?: string;
}): string {
  return cn(scaleFieldRootClassName(orientation, className), slotClass);
}

export function sliderRailClass({
  size,
  disabled,
  variant = "default",
  slotClass,
  className,
}: {
  size: SliderSize;
  disabled?: boolean;
  variant?: SliderVariant;
  slotClass?: string;
  className?: string;
}): string {
  return cn(
    SLIDER_RAIL_LAYOUT_CLASS,
    SELECTION_INDICATOR_RADIUS_CLASS[size],
    isKitVariant(variant, KIT_SLIDER_VARIANTS) && SLIDER_RAIL_DEFAULT_CLASS,
    disabled && SLIDER_RAIL_DISABLED_CLASS,
    slotClass,
    className,
  );
}

export function sliderFillClass({
  isHorizontal,
  variant = "default",
  slotClass,
  className,
}: {
  isHorizontal: boolean;
  variant?: SliderVariant;
  slotClass?: string;
  className?: string;
}): string {
  const visual = resolveVariantVisual(variant, KIT_SLIDER_VARIANTS, "slider.fill");
  const surface =
    visual.className !== undefined ? visual.className : SLIDER_FILL_DEFAULT_CLASS;

  return cn(
    SLIDER_FILL_LAYOUT_CLASS,
    isHorizontal ? SLIDER_FILL_HORIZONTAL_CLASS : SLIDER_FILL_VERTICAL_CLASS,
    surface,
    slotClass,
    className,
  );
}

export function sliderTrackHitAreaClass({
  isHorizontal,
  size,
  thickness,
  variant = "default",
  slotClass,
  className,
}: {
  isHorizontal: boolean;
  size: SliderSize;
  thickness?: number | string;
  variant?: SliderVariant;
  slotClass?: string;
  className?: string;
}): string {
  const visual = resolveVariantVisual(
    variant,
    KIT_SLIDER_VARIANTS,
    "selectionIndicator.root",
  );
  const skinSurface = visual.className !== undefined;

  return cn(
    SLIDER_TRACK_HIT_BASE_CLASS,
    isHorizontal ? SLIDER_TRACK_HIT_HORIZONTAL_CLASS : SLIDER_TRACK_HIT_VERTICAL_CLASS,
    thickness == null && (isHorizontal ? SLIDER_RAIL_HEIGHT[size] : SLIDER_RAIL_WIDTH[size]),
    skinSurface && SELECTION_INDICATOR_RADIUS_CLASS[size],
    skinSurface && SLIDER_RAIL_SKIN_SHAPE_CLASS,
    visual.className,
    slotClass,
    className,
  );
}

export function sliderThumbButtonClass({
  size,
  orientation,
  disabled,
  active,
  slotClass,
  className,
}: {
  size: SliderSize;
  orientation: SliderOrientation;
  disabled?: boolean;
  active?: boolean;
  slotClass?: string;
  className?: string;
}): string {
  return cn(
    SLIDER_THUMB_BUTTON_BASE_CLASS,
    SELECTION_INDICATOR_RADIUS_CLASS[size],
    orientation === "horizontal"
      ? SLIDER_THUMB_BUTTON_HORIZONTAL_CLASS
      : SLIDER_THUMB_BUTTON_VERTICAL_CLASS,
    disabled ? SLIDER_THUMB_BUTTON_DISABLED_CLASS : SLIDER_THUMB_BUTTON_ENABLED_CLASS,
    active ? SLIDER_THUMB_BUTTON_Z_ACTIVE_CLASS : SLIDER_THUMB_BUTTON_Z_CLASS,
    slotClass,
    className,
  );
}

export function sliderThumbPositionStyle(
  percent: number,
  orientation: SliderOrientation,
): CSSProperties {
  return orientation === "horizontal" ? { left: `${percent}%` } : { top: `${100 - percent}%` };
}

export function sliderMarkStyle(
  percent: number,
  orientation: SliderOrientation,
): CSSProperties {
  return orientation === "horizontal"
    ? { left: `${percent}%`, top: "50%", transform: "translate(-50%, -50%)" }
    : { bottom: `${percent}%`, left: "50%", top: "auto", transform: "translate(-50%, 50%)" };
}

export function sliderTrackCrossStyle({
  isHorizontal,
  thickness,
}: {
  isHorizontal: boolean;
  thickness?: number | string;
}): CSSProperties | undefined {
  if (thickness == null) return undefined;
  const crossSizeCss = sliderThicknessToCss(thickness);
  return isHorizontal
    ? { height: crossSizeCss, minHeight: crossSizeCss }
    : { width: crossSizeCss, minWidth: crossSizeCss };
}
