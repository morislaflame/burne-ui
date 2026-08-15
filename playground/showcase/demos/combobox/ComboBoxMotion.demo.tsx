import { ComboBoxMotionInputTintDemo } from "./ComboBoxMotionInputTint.demo";
import { ComboBoxMotionInputWaveDemo } from "./ComboBoxMotionInputWave.demo";
import { ComboBoxMotionInstantHoverDemo } from "./ComboBoxMotionInstantHover.demo";

export function ComboBoxMotionDemo() {
  return (
    <div className="flex w-full flex-col gap-large">
      <ComboBoxMotionInstantHoverDemo />
      <ComboBoxMotionInputWaveDemo />
      <ComboBoxMotionInputTintDemo />
    </div>
  );
}
