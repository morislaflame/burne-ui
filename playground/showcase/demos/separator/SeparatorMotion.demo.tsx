import { SeparatorMotionInstantEnterDemo } from "./SeparatorMotionInstantEnter.demo";
import { SeparatorMotionRootWaveDemo } from "./SeparatorMotionRootWave.demo";
import { SeparatorMotionEnterTintDemo } from "./SeparatorMotionEnterTint.demo";

export function SeparatorMotionDemo() {
  return (
    <div className="flex w-full flex-col items-start gap-large">
      <SeparatorMotionInstantEnterDemo />
      <SeparatorMotionRootWaveDemo />
      <SeparatorMotionEnterTintDemo />
    </div>
  );
}
