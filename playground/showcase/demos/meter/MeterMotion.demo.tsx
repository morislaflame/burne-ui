import { MeterMotionInstantEnterDemo } from "./MeterMotionInstantEnter.demo";
import { MeterMotionTrackWaveDemo } from "./MeterMotionTrackWave.demo";
import { MeterMotionChangeTintDemo } from "./MeterMotionChangeTint.demo";

export function MeterMotionDemo() {
  return (
    <div className="flex w-full flex-col items-start gap-large">
      <MeterMotionInstantEnterDemo />
      <MeterMotionTrackWaveDemo />
      <MeterMotionChangeTintDemo />
    </div>
  );
}
