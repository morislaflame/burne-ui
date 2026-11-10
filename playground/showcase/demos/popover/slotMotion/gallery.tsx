import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { PopoverMotionDefaultDemo } from "./PopoverMotionDefault.demo";
import popoverMotionDefaultSource from "./PopoverMotionDefault.demo.tsx?raw";
import { PopoverMotionInstantLeaveDemo } from "./PopoverMotionInstantLeave.demo";
import popoverMotionInstantLeaveSource from "./PopoverMotionInstantLeave.demo.tsx?raw";
import { PopoverMotionSlideYDemo } from "./PopoverMotionSlideY.demo";
import popoverMotionSlideYSource from "./PopoverMotionSlideY.demo.tsx?raw";
import { PopoverMotionTitleStaggerDemo } from "./PopoverMotionTitleStagger.demo";
import popoverMotionTitleStaggerSource from "./PopoverMotionTitleStagger.demo.tsx?raw";
import { PopoverMotionHeaderDemo } from "./PopoverMotionHeader.demo";
import popoverMotionHeaderSource from "./PopoverMotionHeader.demo.tsx?raw";

export const popoverSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "default", title: "Default", Demo: PopoverMotionDefaultDemo, source: popoverMotionDefaultSource },
  { id: "instant-leave", title: "Instant leave", Demo: PopoverMotionInstantLeaveDemo, source: popoverMotionInstantLeaveSource },
  { id: "slide-y", title: "Slide Y", Demo: PopoverMotionSlideYDemo, source: popoverMotionSlideYSource },
  { id: "title-stagger", title: "Title stagger", Demo: PopoverMotionTitleStaggerDemo, source: popoverMotionTitleStaggerSource },
  { id: "header", title: "Header", Demo: PopoverMotionHeaderDemo, source: popoverMotionHeaderSource },
];

export function PopoverSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Popover Slot motion demos"
      items={popoverSlotMotionGallery}
    />
  );
}
