import { DropdownMotionBodyStaggerDemo } from "./DropdownMotionBodyStagger.demo";
import { DropdownMotionInstantLeaveDemo } from "./DropdownMotionInstantLeave.demo";
import { DropdownMotionOriginScaleDemo } from "./DropdownMotionOriginScale.demo";
import { DropdownMotionSubSlideXDemo } from "./DropdownMotionSubSlideX.demo";

export function DropdownMotionDemo() {
  return (
    <div className="flex w-full flex-wrap items-center gap-mid">
      <DropdownMotionInstantLeaveDemo />
      <DropdownMotionBodyStaggerDemo />
      <DropdownMotionSubSlideXDemo />
      <DropdownMotionOriginScaleDemo />
    </div>
  );
}
