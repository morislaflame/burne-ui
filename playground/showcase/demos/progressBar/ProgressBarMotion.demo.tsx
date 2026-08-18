import { ProgressBarMotionInstantEnterDemo } from "./ProgressBarMotionInstantEnter.demo";
import { ProgressBarMotionFillEnterDemo } from "./ProgressBarMotionFillEnter.demo";
import { ProgressBarMotionTrackWaveDemo } from "./ProgressBarMotionTrackWave.demo";
import { ProgressBarMotionChangeTintDemo } from "./ProgressBarMotionChangeTint.demo";
import { ProgressBarMotionHintEnterDemo } from "./ProgressBarMotionHintEnter.demo";

export function ProgressBarMotionDemo() {
  return (
    <div className="flex w-full flex-col items-start gap-large">
      <ProgressBarMotionInstantEnterDemo />
      <ProgressBarMotionFillEnterDemo />
      <ProgressBarMotionTrackWaveDemo />
      <ProgressBarMotionChangeTintDemo />
      <ProgressBarMotionHintEnterDemo />
    </div>
  );
}
