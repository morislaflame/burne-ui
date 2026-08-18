import { MeterMotionInstantEnterDemo } from "./MeterMotionInstantEnter.demo";
import { MeterMotionFillEnterDemo } from "./MeterMotionFillEnter.demo";
import { MeterMotionTrackWaveDemo } from "./MeterMotionTrackWave.demo";
import { MeterMotionChangeTintDemo } from "./MeterMotionChangeTint.demo";
import { MeterMotionHintEnterDemo } from "./MeterMotionHintEnter.demo";

export function MeterMotionDemo() {
  return (
    <div className="flex w-full flex-col items-start gap-large">
      <MeterMotionInstantEnterDemo />
      <MeterMotionFillEnterDemo />
      <MeterMotionTrackWaveDemo />
      <MeterMotionChangeTintDemo />
      <MeterMotionHintEnterDemo />
    </div>
  );
}
