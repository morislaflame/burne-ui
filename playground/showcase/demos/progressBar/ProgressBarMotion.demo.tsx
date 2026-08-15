import { ProgressBarMotionInstantEnterDemo } from "./ProgressBarMotionInstantEnter.demo";
import { ProgressBarMotionTrackWaveDemo } from "./ProgressBarMotionTrackWave.demo";
import { ProgressBarMotionChangeTintDemo } from "./ProgressBarMotionChangeTint.demo";

export function ProgressBarMotionDemo() {
  return (
    <div className="flex w-full flex-col items-start gap-large">
      <ProgressBarMotionInstantEnterDemo />
      <ProgressBarMotionTrackWaveDemo />
      <ProgressBarMotionChangeTintDemo />
    </div>
  );
}
