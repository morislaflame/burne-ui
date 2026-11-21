import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { DialogMotionTriggerPressDemo } from "./DialogMotionTriggerPress.demo";
import dialogMotionTriggerPressSource from "./DialogMotionTriggerPress.demo.tsx?raw";
import { DialogMotionInstantPanelDemo } from "./DialogMotionInstantPanel.demo";
import dialogMotionInstantPanelSource from "./DialogMotionInstantPanel.demo.tsx?raw";
import { DialogMotionBouncePanelDemo } from "./DialogMotionBouncePanel.demo";
import dialogMotionBouncePanelSource from "./DialogMotionBouncePanel.demo.tsx?raw";
import { DialogMotionTitleStaggerDemo } from "./DialogMotionTitleStagger.demo";
import dialogMotionTitleStaggerSource from "./DialogMotionTitleStagger.demo.tsx?raw";
import { DialogMotionBodyStaggerDemo } from "./DialogMotionBodyStagger.demo";
import dialogMotionBodyStaggerSource from "./DialogMotionBodyStagger.demo.tsx?raw";
import { DialogMotionHeadingBlockDemo } from "./DialogMotionHeadingBlock.demo";
import dialogMotionHeadingBlockSource from "./DialogMotionHeadingBlock.demo.tsx?raw";
import { DialogMotionPerPartDemo } from "./DialogMotionPerPart.demo";
import dialogMotionPerPartSource from "./DialogMotionPerPart.demo.tsx?raw";
import { DialogMotionTitleHoverColorDemo } from "./DialogMotionTitleHoverColor.demo";
import dialogMotionTitleHoverColorSource from "./DialogMotionTitleHoverColor.demo.tsx?raw";
import { DialogMotionPanelTimelineDemo } from "./DialogMotionPanelTimeline.demo";
import dialogMotionPanelTimelineSource from "./DialogMotionPanelTimeline.demo.tsx?raw";

export const dialogSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "trigger-press", title: "Trigger press", Demo: DialogMotionTriggerPressDemo, source: dialogMotionTriggerPressSource },
  { id: "instant-panel", title: "Instant panel", Demo: DialogMotionInstantPanelDemo, source: dialogMotionInstantPanelSource },
  { id: "bounce-panel", title: "Bounce panel", Demo: DialogMotionBouncePanelDemo, source: dialogMotionBouncePanelSource },
  { id: "title-stagger", title: "Title stagger", Demo: DialogMotionTitleStaggerDemo, source: dialogMotionTitleStaggerSource },
  { id: "body-stagger", title: "Body stagger", Demo: DialogMotionBodyStaggerDemo, source: dialogMotionBodyStaggerSource },
  { id: "heading-block", title: "Heading block", Demo: DialogMotionHeadingBlockDemo, source: dialogMotionHeadingBlockSource },
  { id: "per-part", title: "Per part", Demo: DialogMotionPerPartDemo, source: dialogMotionPerPartSource },
  { id: "title-hover-color", title: "Title hover color", Demo: DialogMotionTitleHoverColorDemo, source: dialogMotionTitleHoverColorSource },
  { id: "panel-timeline", title: "Panel timeline", Demo: DialogMotionPanelTimelineDemo, source: dialogMotionPanelTimelineSource },
];

export function DialogSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Dialog Slot motion demos"
      items={dialogSlotMotionGallery}
    />
  );
}
