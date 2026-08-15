import { LabelMotionInstantEnterDemo } from "./LabelMotionInstantEnter.demo";
import { LabelMotionRootWaveDemo } from "./LabelMotionRootWave.demo";
import { LabelMotionEnterTintDemo } from "./LabelMotionEnterTint.demo";

export function LabelMotionDemo() {
  return (
    <div className="flex w-full flex-col items-start gap-large">
      <LabelMotionInstantEnterDemo />
      <LabelMotionRootWaveDemo />
      <LabelMotionEnterTintDemo />
    </div>
  );
}
