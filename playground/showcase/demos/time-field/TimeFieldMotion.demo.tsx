import { TimeFieldMotionAffixWaveDemo } from "./TimeFieldMotionAffixWave.demo";
import { TimeFieldMotionHintEnterDemo } from "./TimeFieldMotionHintEnter.demo";
import { TimeFieldMotionInstantHoverDemo } from "./TimeFieldMotionInstantHover.demo";
import { TimeFieldMotionPrefixTintDemo } from "./TimeFieldMotionPrefixTint.demo";

export function TimeFieldMotionDemo() {
  return (
    <div className="flex w-full flex-col gap-large">
      <TimeFieldMotionInstantHoverDemo />
      <TimeFieldMotionAffixWaveDemo />
      <TimeFieldMotionPrefixTintDemo />
      <TimeFieldMotionHintEnterDemo />
    </div>
  );
}
