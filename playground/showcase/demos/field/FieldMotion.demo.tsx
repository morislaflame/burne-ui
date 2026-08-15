import { FieldMotionInstantEnterDemo } from "./FieldMotionInstantEnter.demo";
import { FieldMotionRootWaveDemo } from "./FieldMotionRootWave.demo";
import { FieldMotionErrorTintDemo } from "./FieldMotionErrorTint.demo";

export function FieldMotionDemo() {
  return (
    <div className="flex w-full flex-col items-start gap-large">
      <FieldMotionInstantEnterDemo />
      <FieldMotionRootWaveDemo />
      <FieldMotionErrorTintDemo />
    </div>
  );
}
