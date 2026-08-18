import { DropdownMotionLabelDemo } from "./DropdownMotionLabel.demo";
import { DropdownMotionBodyStaggerDemo } from "./DropdownMotionBodyStagger.demo";
import { DropdownMotionInstantLeaveDemo } from "./DropdownMotionInstantLeave.demo";
import { DropdownMotionOriginScaleDemo } from "./DropdownMotionOriginScale.demo";
import { DropdownMotionSeparatorDemo } from "./DropdownMotionSeparator.demo";
import { DropdownMotionSubSlideXDemo } from "./DropdownMotionSubSlideX.demo";
import { DropdownMotionTriggerPressDemo } from "./DropdownMotionTriggerPress.demo";

export function DropdownMotionDemo() {
  return (
    <div className="flex w-full flex-wrap items-center gap-mid">
      <DropdownMotionTriggerPressDemo />
      <DropdownMotionInstantLeaveDemo />
      <DropdownMotionBodyStaggerDemo />
      <DropdownMotionLabelDemo />
      <DropdownMotionSeparatorDemo />
      <DropdownMotionSubSlideXDemo />
      <DropdownMotionOriginScaleDemo />
    </div>
  );
}
