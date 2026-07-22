import {
  ColorPickerAlphaInput,
  ColorPickerArea,
  ColorPickerContent,
  ColorPickerHexInput,
  ColorPickerPresets,
  ColorPickerRoot,
  ColorPickerTrigger,
} from "./ColorPicker";
import { ColorSliderRoot, ColorSliderTrack } from "./ColorSlider";

export const ColorPicker = Object.assign(ColorPickerRoot, {
  Trigger: ColorPickerTrigger,
  Content: ColorPickerContent,
  Area: ColorPickerArea,
  HexInput: ColorPickerHexInput,
  AlphaInput: ColorPickerAlphaInput,
  Presets: ColorPickerPresets,
});

export const ColorSlider = Object.assign(ColorSliderRoot, {
  Track: ColorSliderTrack,
});

export { useColorPicker } from "./colorPickerContext";

export type {
  ColorPickerProps,
  ColorPickerTriggerProps,
  ColorPickerContentProps,
  ColorPickerAreaProps,
  ColorPickerHexInputProps,
  ColorPickerAlphaInputProps,
  ColorPickerPresetsProps,
  ColorPickerSize,
  ColorPickerVariant,
  ColorPickerClassNames,
} from "./colorPickerTypes";

export type {
  ColorSliderTrackProps,
  ColorSliderProps,
  ColorChannel,
  ColorSliderSize,
  ColorSliderOrientation,
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
