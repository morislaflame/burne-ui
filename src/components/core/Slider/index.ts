import { Label } from "@/components/core/Label";

import {
  SliderError,
  SliderFill,
  SliderHeader,
  SliderHint,
  SliderIcon,
  SliderRail,
  SliderRoot,
  SliderThumb,
  SliderTrack,
  SliderValue,
  sliderThicknessToCss,
} from "./Slider";

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
  SliderRootProps,
  SliderHeaderProps,
  SliderValueProps,
  SliderHintProps,
  SliderErrorProps,
  SliderClassNames,
} from "./sliderTypes";

export { sliderThicknessToCss };
