import { SHADOW_LIFT_MOTION_CLASS } from "@/components/core/utils/useShadowMotion";
import { cn } from "@/utils/cn";

import type { ColorSwatchClassNames, ColorSwatchShape, ColorSwatchSize } from "./colorSwatchTypes";

export const COLOR_SWATCH_DECORATIVE_CLASS = "relative shrink-0 overflow-hidden";

export const COLOR_SWATCH_BUTTON_CLASS =
  "relative shrink-0 origin-center overflow-hidden focus-ring";

/** Selection ring. Keyboard focus stays on `focus-ring`. */
export const COLOR_SWATCH_SELECTED_CLASS =
  "ring-2 ring-primary ring-offset-2 ring-offset-background";

export const COLOR_SWATCH_SIZE_CLASS: Record<ColorSwatchSize, string> = {
  small: "h-5 w-5",
  base: "h-6 w-6",
  mid: "h-7 w-7",
  large: "h-8 w-8",
};

export const COLOR_SWATCH_SHAPE_CLASS: Record<ColorSwatchShape, string> = {
  circle: "rounded-full",
  rounded: "rounded-small",
  square: "rounded-none",
};

function colorSwatchStateClass(disabled: boolean, interactive: boolean): string {
  if (disabled) return "cursor-not-allowed opacity-40";
  if (interactive) return "cursor-pointer";
  return "cursor-default";
}

export function colorSwatchClass({
  size,
  shape,
  selected,
  disabled,
  interactive,
  className,
  classNames,
}: {
  size: ColorSwatchSize;
  shape: ColorSwatchShape;
  selected: boolean;
  disabled: boolean;
  interactive: boolean;
  className?: string;
  classNames?: ColorSwatchClassNames;
}): string {
  return cn(
    interactive ? COLOR_SWATCH_BUTTON_CLASS : COLOR_SWATCH_DECORATIVE_CLASS,
    interactive && SHADOW_LIFT_MOTION_CLASS,
    COLOR_SWATCH_SIZE_CLASS[size],
    COLOR_SWATCH_SHAPE_CLASS[shape],
    selected && COLOR_SWATCH_SELECTED_CLASS,
    colorSwatchStateClass(disabled, interactive),
    classNames?.root,
    selected && classNames?.selected,
    className,
  );
}
