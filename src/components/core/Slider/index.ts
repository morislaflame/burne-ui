import {
  SliderTrack,
  SliderFill,
  SliderIcon,
  SliderRail,
  SliderThumb,
  type SliderTrackProps,
  type SliderSingleProps,
  type SliderRangeProps,
  type SliderOrientation,
  type SliderSize,
  type SliderThickness,
  type SliderFillProps,
  type SliderIconProps,
  type SliderRailProps,
  type SliderThumbProps,
  type SliderThumbKind,
  sliderThicknessToCss,
} from "./Slider";
import { Label } from "@/components/core/Label";
import { SliderError, SliderHeader, SliderHint, SliderRoot, SliderValue } from "./SliderField";

export const Slider = Object.assign(SliderRoot, {
  Header: SliderHeader,
  Label,
  Value: SliderValue,
  Hint: SliderHint,
  Error: SliderError,
  Track: SliderTrack,
  Rail: SliderRail,
  Fill: SliderFill,
  Thumb: SliderThumb,
  Icon: SliderIcon,
});

export type {
  SliderTrackProps,
  SliderSingleProps,
  SliderRangeProps,
  SliderOrientation,
  SliderSize,
  SliderThickness,
  SliderFillProps,
  SliderIconProps,
  SliderRailProps,
  SliderThumbProps,
  SliderThumbKind,
};
export { sliderThicknessToCss };
export type { SliderRootProps, SliderHeaderProps, SliderValueProps, SliderHintProps, SliderErrorProps } from "./SliderField";
