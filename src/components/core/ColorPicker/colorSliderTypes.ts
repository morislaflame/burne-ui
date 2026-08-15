import type { HTMLAttributes } from "react";
import type { Prettify } from "@/utils/prettify";
import type { MotionValue } from "@/components/core/utils/slotMotion";

import type { SliderOrientation, SliderSize } from "@/components/core/Slider/sliderTypes";

import type { HSVA } from "./colorUtils";

export type ColorChannel =
  | "hue"
  | "saturation"
  | "value"
  | "alpha"
  | "red"
  | "green"
  | "blue";

export type ColorSliderSize = SliderSize;
export type ColorSliderOrientation = SliderOrientation;

export type ColorSliderPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
  change?: MotionValue;
};

export type ColorSliderMotion = {
  root?: ColorSliderPartMotion;
  track?: ColorSliderPartMotion;
};

export type ColorSliderTrackProps = Omit<HTMLAttributes<HTMLDivElement>, "color"> & {
  channel: ColorChannel;
  color?: HSVA;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  size?: ColorSliderSize;
  orientation?: ColorSliderOrientation;
  disabled?: boolean;
  /**
   * Per-slot motion for the track (`enter` / `change`). Thumb geometry stays kit-internal.
   * Defaults are empty.
   */
  motion?: Prettify<ColorSliderPartMotion>;
};

export type ColorSliderProps = Omit<HTMLAttributes<HTMLDivElement>, "color"> & {
  channel: ColorChannel;
  color?: HSVA;
  label?: string;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  size?: ColorSliderSize;
  orientation?: ColorSliderOrientation;
  disabled?: boolean;
  /**
   * Per-slot motion (`root`, `track`). Nested ColorSlider.Track does not inherit defaults.
   * Pass `motion.track` through to Track. Defaults are empty.
   */
  motion?: Prettify<ColorSliderMotion>;
};
