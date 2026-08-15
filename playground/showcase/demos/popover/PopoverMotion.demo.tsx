import { PopoverMotionDefaultDemo } from "./PopoverMotionDefault.demo";
import { PopoverMotionInstantLeaveDemo } from "./PopoverMotionInstantLeave.demo";
import { PopoverMotionSlideYDemo } from "./PopoverMotionSlideY.demo";
import { PopoverMotionTitleStaggerDemo } from "./PopoverMotionTitleStagger.demo";

export function PopoverMotionDemo() {
  return (
    <div className="flex w-full flex-col gap-large">
      <div className="flex flex-wrap items-center gap-mid">
        <PopoverMotionDefaultDemo />
        <PopoverMotionInstantLeaveDemo />
        <PopoverMotionSlideYDemo />
        <PopoverMotionTitleStaggerDemo />
      </div>
    </div>
  );
}
