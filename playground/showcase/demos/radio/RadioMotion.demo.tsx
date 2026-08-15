import { RadioMotionCornerFillDemo } from "./RadioMotionCornerFill.demo";
import { RadioMotionFillMarkStaggerDemo } from "./RadioMotionFillMarkStagger.demo";
import { RadioMotionSpinningMarkDemo } from "./RadioMotionSpinningMark.demo";

export function RadioMotionDemo() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-large">
      <RadioMotionCornerFillDemo />
      <RadioMotionSpinningMarkDemo />
      <RadioMotionFillMarkStaggerDemo />
    </div>
  );
}
