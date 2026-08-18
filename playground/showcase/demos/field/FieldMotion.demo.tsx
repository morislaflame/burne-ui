import { FieldMotionErrorTintDemo } from "./FieldMotionErrorTint.demo";
import { FieldMotionInstantEnterDemo } from "./FieldMotionInstantEnter.demo";
import { FieldMotionLabelHintDemo } from "./FieldMotionLabelHint.demo";
import { FieldMotionRootWaveDemo } from "./FieldMotionRootWave.demo";

export function FieldMotionDemo() {
  return (
    <div className="flex w-full flex-col items-start gap-large">
      <FieldMotionInstantEnterDemo />
      <FieldMotionRootWaveDemo />
      <FieldMotionErrorTintDemo />
      <FieldMotionLabelHintDemo />
    </div>
  );
}
