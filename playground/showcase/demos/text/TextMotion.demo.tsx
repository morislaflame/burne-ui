import { TextMotionInstantEnterDemo } from "./TextMotionInstantEnter.demo";
import { TextMotionRootWaveDemo } from "./TextMotionRootWave.demo";
import { TextMotionEnterTintDemo } from "./TextMotionEnterTint.demo";

export function TextMotionDemo() {
  return (
    <div className="flex w-full flex-col items-start gap-large">
      <TextMotionInstantEnterDemo />
      <TextMotionRootWaveDemo />
      <TextMotionEnterTintDemo />
    </div>
  );
}
