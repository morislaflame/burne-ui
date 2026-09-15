import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { TooltipMotionDefaultDemo } from "./TooltipMotionDefault.demo";
import tooltipMotionDefaultSource from "./TooltipMotionDefault.demo.tsx?raw";
import { TooltipMotionInstantLeaveDemo } from "./TooltipMotionInstantLeave.demo";
import tooltipMotionInstantLeaveSource from "./TooltipMotionInstantLeave.demo.tsx?raw";
import { TooltipMotionSlideYDemo } from "./TooltipMotionSlideY.demo";
import tooltipMotionSlideYSource from "./TooltipMotionSlideY.demo.tsx?raw";
import { TooltipMotionPanelDemo } from "./TooltipMotionPanel.demo";
import tooltipMotionPanelSource from "./TooltipMotionPanel.demo.tsx?raw";
import { TooltipMotionStaggerDemo } from "./TooltipMotionStagger.demo";
import tooltipMotionStaggerSource from "./TooltipMotionStagger.demo.tsx?raw";
import { TooltipMotionSideSlideDemo } from "./TooltipMotionSideSlide.demo";
import tooltipMotionSideSlideSource from "./TooltipMotionSideSlide.demo.tsx?raw";

export const tooltipSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "default", title: "Default", Demo: TooltipMotionDefaultDemo, source: tooltipMotionDefaultSource },
  { id: "instant-leave", title: "Instant leave", Demo: TooltipMotionInstantLeaveDemo, source: tooltipMotionInstantLeaveSource },
  { id: "slide-y", title: "Slide Y", Demo: TooltipMotionSlideYDemo, source: tooltipMotionSlideYSource },
  { id: "panel", title: "Panel", Demo: TooltipMotionPanelDemo, source: tooltipMotionPanelSource },
  { id: "stagger", title: "Stagger", Demo: TooltipMotionStaggerDemo, source: tooltipMotionStaggerSource },
  { id: "side-slide", title: "Side slide", Demo: TooltipMotionSideSlideDemo, source: tooltipMotionSideSlideSource },
];

export function TooltipSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Tooltip Slot motion demos"
      items={tooltipSlotMotionGallery}
    />
  );
}
