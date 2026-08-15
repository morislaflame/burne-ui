import { SliderError, SliderFill, SliderHeader, SliderHint, SliderIcon, SliderLabel, SliderRail, SliderRoot, SliderThumb, SliderTrack, SliderValue } from "./Slider";
import { sliderThicknessToCss } from "./sliderAPI";
import { useOptionalSliderFieldContext, useSliderFieldContext } from "./sliderContext";

export const Slider = Object.assign(SliderRoot, {
  Header: SliderHeader,
  Label: SliderLabel,
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
  SliderProps,
  SliderHeaderProps,
  SliderValueProps,
  SliderHintProps,
  SliderErrorProps,
  SliderClassNames,
  SliderMotion,
  SliderPartMotion,
} from "./sliderTypes";

export { sliderThicknessToCss };

export {
  useOptionalSliderFieldContext,
  useSliderFieldContext,
};
