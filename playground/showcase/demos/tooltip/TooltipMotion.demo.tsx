import { TooltipMotionDefaultDemo } from "./TooltipMotionDefault.demo";
import { TooltipMotionInstantLeaveDemo } from "./TooltipMotionInstantLeave.demo";
import { TooltipMotionSideSlideDemo } from "./TooltipMotionSideSlide.demo";
import { TooltipMotionSlideYDemo } from "./TooltipMotionSlideY.demo";
import { TooltipMotionPanelDemo } from "./TooltipMotionPanel.demo";
import { TooltipMotionStaggerDemo } from "./TooltipMotionStagger.demo";

export function TooltipMotionDemo() {
  return (
    <div className="flex w-full flex-col gap-large">
      <div className="flex flex-wrap items-center gap-mid">
        <TooltipMotionDefaultDemo />
        <TooltipMotionInstantLeaveDemo />
        <TooltipMotionSlideYDemo />
      </div>
      <TooltipMotionPanelDemo />
      <TooltipMotionStaggerDemo />
      <TooltipMotionSideSlideDemo />
    </div>
  );
}
