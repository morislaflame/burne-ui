import { SliderMotionInstantPressDemo } from "./SliderMotionInstantPress.demo";
import { SliderMotionRangeSplitDemo } from "./SliderMotionRangeSplit.demo";
import { SliderMotionTrackGlowDemo } from "./SliderMotionTrackGlow.demo";
import { SliderMotionValuePopDemo } from "./SliderMotionValuePop.demo";

export function SliderMotionDemo() {
  return (
    <div className="flex w-full flex-col gap-2xlarge">
      <SliderMotionInstantPressDemo />
      <SliderMotionValuePopDemo />
      <SliderMotionRangeSplitDemo />
      <SliderMotionTrackGlowDemo />
    </div>
  );
}
