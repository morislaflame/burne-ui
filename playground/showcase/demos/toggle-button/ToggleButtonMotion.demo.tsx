import { ToggleButtonMotionFillFromBottomDemo } from "./ToggleButtonMotionFillFromBottom.demo";
import { ToggleButtonMotionIconSpinDemo } from "./ToggleButtonMotionIconSpin.demo";
import { ToggleButtonMotionInstantFillDemo } from "./ToggleButtonMotionInstantFill.demo";
import { ToggleButtonMotionTextTintDemo } from "./ToggleButtonMotionTextTint.demo";

export function ToggleButtonMotionDemo() {
  return (
    <div className="flex w-full flex-wrap items-center gap-mid">
      <ToggleButtonMotionInstantFillDemo />
      <ToggleButtonMotionFillFromBottomDemo />
      <ToggleButtonMotionIconSpinDemo />
      <ToggleButtonMotionTextTintDemo />
    </div>
  );
}
