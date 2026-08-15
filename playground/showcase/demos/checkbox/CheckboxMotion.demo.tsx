import { CheckboxMotionCornerFillDemo } from "./CheckboxMotionCornerFill.demo";
import { CheckboxMotionCornerFillCompoundDemo } from "./CheckboxMotionCornerFillCompound.demo";
import { CheckboxMotionFillMarkStaggerDemo } from "./CheckboxMotionFillMarkStagger.demo";
import { CheckboxMotionLabelColorDemo } from "./CheckboxMotionLabelColor.demo";
import { CheckboxMotionSpinningMarkDemo } from "./CheckboxMotionSpinningMark.demo";

export function CheckboxMotionDemo() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-large">
      <CheckboxMotionCornerFillDemo />
      <CheckboxMotionCornerFillCompoundDemo />
      <CheckboxMotionSpinningMarkDemo />
      <CheckboxMotionLabelColorDemo />
      <CheckboxMotionFillMarkStaggerDemo />
    </div>
  );
}
