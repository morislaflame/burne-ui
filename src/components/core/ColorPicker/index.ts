import { ColorPickerContent, ColorPickerRoot, ColorPickerTrigger } from "./ColorPicker";
import { ColorSliderRoot, ColorSliderTrack } from "./ColorSlider";

export const ColorPicker = Object.assign(ColorPickerRoot, {
  Trigger: ColorPickerTrigger,
  Content: ColorPickerContent,
});

export const ColorSlider = Object.assign(ColorSliderRoot, {
  Track: ColorSliderTrack,
});

export { useColorPicker } from "./ColorPicker";

export type {
  ColorPickerProps,
  ColorPickerTriggerProps,
  ColorPickerContentProps,
  ColorPickerSize,
} from "./ColorPicker";

export {
  ColorSliderTrack,
  type ColorSliderTrackProps,
  type ColorSliderRootProps,
  type ColorChannel,
  type ColorSliderSize,
  type ColorSliderOrientation,
} from "./ColorSlider";

export {
  ColorSwatch,
  type ColorSwatchProps,
  type ColorSwatchSize,
  type ColorSwatchShape,
} from "./ColorSwatch";

export {
  hsvaToHex,
  hexToHsva,
  hsvaToRgba,
  rgbaToHsva,
  rgbaToHex,
  hexToRgba,
  hsvaToColorString,
  hueToRgbString,
  type HSVA,
  type RGBA,
} from "./colorUtils";
