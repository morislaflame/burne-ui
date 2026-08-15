import { SelectionThumbMotionInstantEnterDemo } from "./SelectionThumbMotionInstantEnter.demo";
import { SelectionThumbMotionRootWaveDemo } from "./SelectionThumbMotionRootWave.demo";
import { SelectionThumbMotionEnterTintDemo } from "./SelectionThumbMotionEnterTint.demo";

export function SelectionThumbMotionDemo() {
  return (
    <div className="flex w-full flex-col items-start gap-large">
      <SelectionThumbMotionInstantEnterDemo />
      <SelectionThumbMotionRootWaveDemo />
      <SelectionThumbMotionEnterTintDemo />
    </div>
  );
}
