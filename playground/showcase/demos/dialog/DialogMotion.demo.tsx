import { DialogMotionHeadingBlockDemo } from "./DialogMotionHeadingBlock.demo";
import { DialogMotionBodyStaggerDemo } from "./DialogMotionBodyStagger.demo";
import { DialogMotionBouncePanelDemo } from "./DialogMotionBouncePanel.demo";
import { DialogMotionInstantPanelDemo } from "./DialogMotionInstantPanel.demo";
import { DialogMotionPanelTimelineDemo } from "./DialogMotionPanelTimeline.demo";
import { DialogMotionPerPartDemo } from "./DialogMotionPerPart.demo";
import { DialogMotionTitleHoverColorDemo } from "./DialogMotionTitleHoverColor.demo";
import { DialogMotionTitleStaggerDemo } from "./DialogMotionTitleStagger.demo";
import { DialogMotionTriggerPressDemo } from "./DialogMotionTriggerPress.demo";

export function DialogMotionDemo() {
  return (
    <div className="flex w-full flex-col gap-large">
      <div className="flex flex-wrap items-center gap-mid">
        <DialogMotionTriggerPressDemo />
        <DialogMotionInstantPanelDemo />
        <DialogMotionBouncePanelDemo />
      </div>
      <DialogMotionTitleStaggerDemo />
      <DialogMotionBodyStaggerDemo />
      <DialogMotionHeadingBlockDemo />
      <DialogMotionPerPartDemo />
      <DialogMotionTitleHoverColorDemo />
      <DialogMotionPanelTimelineDemo />
    </div>
  );
}
