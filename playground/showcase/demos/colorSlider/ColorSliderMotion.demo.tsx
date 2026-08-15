import { ColorSliderMotionInstantEnterDemo } from "./ColorSliderMotionInstantEnter.demo";
import { ColorSliderMotionTrackWaveDemo } from "./ColorSliderMotionTrackWave.demo";
import { ColorSliderMotionChangeTintDemo } from "./ColorSliderMotionChangeTint.demo";

export function ColorSliderMotionDemo() {
  return (
    <div className="flex w-full flex-col items-start gap-large">
      <ColorSliderMotionInstantEnterDemo />
      <ColorSliderMotionTrackWaveDemo />
      <ColorSliderMotionChangeTintDemo />
    </div>
  );
}
