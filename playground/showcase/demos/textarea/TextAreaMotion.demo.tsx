import { TextAreaMotionControlTintDemo } from "./TextAreaMotionControlTint.demo";
import { TextAreaMotionInstantHoverDemo } from "./TextAreaMotionInstantHover.demo";
import { TextAreaMotionResizePulseDemo } from "./TextAreaMotionResizePulse.demo";
import { TextAreaMotionShellWaveDemo } from "./TextAreaMotionShellWave.demo";

export function TextAreaMotionDemo() {
  return (
    <div className="flex w-full flex-col gap-large">
      <TextAreaMotionInstantHoverDemo />
      <TextAreaMotionShellWaveDemo />
      <TextAreaMotionResizePulseDemo />
      <TextAreaMotionControlTintDemo />
    </div>
  );
}
