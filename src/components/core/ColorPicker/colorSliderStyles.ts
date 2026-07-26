import type { CSSProperties } from "react";

import { SELECTION_INDICATOR_RADIUS_CLASS } from "@/components/core/SelectionIndicator/selectionIndicatorTokens";
import { sliderTrackHitAreaClass } from "@/components/core/Slider/sliderStyles";
import { cn } from "@/utils/cn";

import { alphaSliderGradientStyle, hsvaToRgba, hueToRgbString, type HSVA } from "./colorUtils";
import type { ColorChannel, ColorSliderOrientation, ColorSliderSize } from "./colorSliderTypes";

/** Clip channel gradient — same radius token as Slider rail / SelectionIndicator. */
export const COLOR_SLIDER_TRACK_OVERFLOW_CLASS = "overflow-hidden";

export const COLOR_SLIDER_DISABLED_CLASS = "opacity-48";

export const COLOR_SLIDER_ROOT_CLASS = "flex flex-col gap-xsmall";

export const COLOR_SLIDER_LABEL_ROW_CLASS = "flex items-center justify-between";

export const COLOR_SLIDER_LABEL_TEXT_CLASS = "text-muted";

export const COLOR_SLIDER_VALUE_TEXT_CLASS = "font-w-mid text-foreground";

export const CHANNEL_A11Y_LABEL: Record<ColorChannel, string> = {
  hue: "Hue",
  saturation: "Saturation",
  value: "Value",
  alpha: "Alpha",
  red: "Red",
  green: "Green",
  blue: "Blue",
};

export function colorSliderTrackClass({
  size,
  orientation,
  disabled,
  className,
}: {
  size: ColorSliderSize;
  orientation: ColorSliderOrientation;
  disabled?: boolean;
  className?: string;
}): string {
  const isHorizontal = orientation === "horizontal";

  return cn(
    sliderTrackHitAreaClass({
      isHorizontal,
      size,
      className,
    }),
    COLOR_SLIDER_TRACK_OVERFLOW_CLASS,
    SELECTION_INDICATOR_RADIUS_CLASS[size],
    disabled && COLOR_SLIDER_DISABLED_CLASS,
  );
}

export function colorSliderBackgroundStyle(
  channel: ColorChannel,
  color: HSVA,
  orientation: ColorSliderOrientation,
): CSSProperties {
  const horizontal = orientation === "horizontal";

  if (channel === "alpha") {
    return alphaSliderGradientStyle(color, horizontal);
  }

  const dir = horizontal ? "to right" : "to top";
  const { r, g, b } = hsvaToRgba(color);

  switch (channel) {
    case "hue":
      /* Channel gradients use fixed RGB endpoints — picker physics, not theme. */
      return {
        background: `linear-gradient(${dir}, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)`,
      };
    case "saturation": {
      const desaturated = hsvaToRgba({ ...color, s: 0 });
      const pure = hueToRgbString(color.h);
      return {
        background: `linear-gradient(${dir}, rgb(${desaturated.r},${desaturated.g},${desaturated.b}), ${pure})`,
      };
    }
    case "value": {
      const pure = hueToRgbString(color.h);
      /* Fixed #000 black endpoint — value channel physics. */
      return { background: `linear-gradient(${dir}, #000, ${pure})` };
    }
    case "red":
      return { background: `linear-gradient(${dir}, rgb(0,${g},${b}), rgb(255,${g},${b}))` };
    case "green":
      return { background: `linear-gradient(${dir}, rgb(${r},0,${b}), rgb(${r},255,${b}))` };
    case "blue":
      return { background: `linear-gradient(${dir}, rgb(${r},${g},0), rgb(${r},${g},255))` };
  }
}
