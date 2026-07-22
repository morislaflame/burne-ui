import type { HTMLAttributes } from "react";

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

export type ColorSliderTrackProps = Omit<HTMLAttributes<HTMLDivElement>, "color"> & {
  channel: ColorChannel;
  color?: HSVA;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  size?: ColorSliderSize;
  orientation?: ColorSliderOrientation;
  disabled?: boolean;
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
};
