import { SelectMotionInstantHoverDemo } from "./SelectMotionInstantHover.demo";
import { SelectMotionTriggerWaveDemo } from "./SelectMotionTriggerWave.demo";
import { SelectMotionValueTintDemo } from "./SelectMotionValueTint.demo";

export function SelectMotionDemo() {
  return (
    <div className="flex w-full flex-col gap-large">
      <SelectMotionInstantHoverDemo />
      <SelectMotionTriggerWaveDemo />
      <SelectMotionValueTintDemo />
    </div>
  );
}
