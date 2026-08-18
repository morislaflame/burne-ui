import { ColorPickerMotionInstantEnterDemo } from "./ColorPickerMotionInstantEnter.demo";
import { ColorPickerMotionPanelWaveDemo } from "./ColorPickerMotionPanelWave.demo";
import { ColorPickerMotionAlphaInputDemo } from "./ColorPickerMotionAlphaInput.demo";
import { ColorPickerMotionAreaChangeDemo } from "./ColorPickerMotionAreaChange.demo";
import { ColorPickerMotionPreviewSwatchDemo } from "./ColorPickerMotionPreviewSwatch.demo";

export function ColorPickerMotionDemo() {
  return (
    <div className="flex w-full flex-col items-start gap-large">
      <ColorPickerMotionInstantEnterDemo />
      <ColorPickerMotionPanelWaveDemo />
      <ColorPickerMotionAreaChangeDemo />
      <ColorPickerMotionAlphaInputDemo />
      <ColorPickerMotionPreviewSwatchDemo />
    </div>
  );
}
