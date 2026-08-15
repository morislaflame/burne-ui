import { DialogMotionBouncePanelDemo } from "./DialogMotionBouncePanel.demo";
import { DialogMotionInstantPanelDemo } from "./DialogMotionInstantPanel.demo";
import { DialogMotionPanelTimelineDemo } from "./DialogMotionPanelTimeline.demo";
import { DialogMotionPerPartDemo } from "./DialogMotionPerPart.demo";
import { DialogMotionTitleHoverColorDemo } from "./DialogMotionTitleHoverColor.demo";
import { DialogMotionTitleStaggerDemo } from "./DialogMotionTitleStagger.demo";

export function DialogMotionDemo() {
  return (
    <div className="flex w-full flex-col gap-large">
      <div className="flex flex-wrap items-center gap-mid">
        <DialogMotionInstantPanelDemo />
        <DialogMotionBouncePanelDemo />
      </div>
      <DialogMotionTitleStaggerDemo />
      <DialogMotionPerPartDemo />
      <DialogMotionTitleHoverColorDemo />
      <DialogMotionPanelTimelineDemo />
    </div>
  );
}
