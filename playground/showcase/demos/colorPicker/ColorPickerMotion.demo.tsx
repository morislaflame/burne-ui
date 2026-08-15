import { ColorPickerMotionInstantEnterDemo } from "./ColorPickerMotionInstantEnter.demo";
import { ColorPickerMotionPanelWaveDemo } from "./ColorPickerMotionPanelWave.demo";
import { ColorPickerMotionAreaChangeDemo } from "./ColorPickerMotionAreaChange.demo";

export function ColorPickerMotionDemo() {
  return (
    <div className="flex w-full flex-col items-start gap-large">
      <ColorPickerMotionInstantEnterDemo />
      <ColorPickerMotionPanelWaveDemo />
      <ColorPickerMotionAreaChangeDemo />
    </div>
  );
}
