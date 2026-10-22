import {
  ColorPickerAlphaInput,
  ColorPickerArea,
  ColorPickerContent,
  ColorPickerError,
  ColorPickerHexInput,
  ColorPickerHint,
  ColorPickerLabel,
  ColorPickerPresets,
  ColorPickerPreview,
  ColorPickerRoot,
  ColorPickerTrigger,
} from "./ColorPicker";
import { ColorSliderRoot, ColorSliderTrack } from "./ColorSlider";
 
export const ColorPicker = Object.assign(ColorPickerRoot, {
  Trigger: ColorPickerTrigger,
  Label: ColorPickerLabel,
  Hint: ColorPickerHint,
  Error: ColorPickerError,
  Content: ColorPickerContent,
  Area: ColorPickerArea,
  Preview: ColorPickerPreview,
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
  ColorPickerPreviewProps,
  ColorPickerSize,
  ColorPickerVariant,
  ColorPickerClassNames,
  ColorPickerMotion,
  ColorPickerPartMotion,
} from "./colorPickerTypes";
 
export type {
  ColorSliderTrackProps,
  ColorSliderProps,
  ColorSliderClassNames,
  ColorChannel,
  ColorSliderSize,
  ColorSliderOrientation,
  ColorSliderMotion,
  ColorSliderPartMotion,
} from "./ColorSlider";
 
export {
  ColorSwatch,
  type ColorSwatchClassNames,
  type ColorSwatchProps,
  type ColorSwatchSize,
  type ColorSwatchShape,
  type ColorSwatchMotion,
  type ColorSwatchPartMotion,
} from "./ColorSwatch";
 
export type { HSVA, RGBA } from "./colorUtils";
 