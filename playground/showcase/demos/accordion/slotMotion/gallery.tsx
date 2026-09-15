import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { AccordionMotionInstantPanelDemo } from "./AccordionMotionInstantPanel.demo";
import accordionMotionInstantPanelSource from "./AccordionMotionInstantPanel.demo.tsx?raw";
import { AccordionMotionChevronDemo } from "./AccordionMotionChevron.demo";
import accordionMotionChevronSource from "./AccordionMotionChevron.demo.tsx?raw";
import { AccordionMotionBodyDemo } from "./AccordionMotionBody.demo";
import accordionMotionBodySource from "./AccordionMotionBody.demo.tsx?raw";
import { AccordionMotionBounceHeightDemo } from "./AccordionMotionBounceHeight.demo";
import accordionMotionBounceHeightSource from "./AccordionMotionBounceHeight.demo.tsx?raw";

export const accordionSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "instant-panel", title: "Instant panel", Demo: AccordionMotionInstantPanelDemo, source: accordionMotionInstantPanelSource },
  { id: "chevron", title: "Chevron", Demo: AccordionMotionChevronDemo, source: accordionMotionChevronSource },
  { id: "body", title: "Body", Demo: AccordionMotionBodyDemo, source: accordionMotionBodySource },
  { id: "bounce-height", title: "Bounce height", Demo: AccordionMotionBounceHeightDemo, source: accordionMotionBounceHeightSource },
];

export function AccordionSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Accordion Slot motion demos"
      align="stretch"
      items={accordionSlotMotionGallery}
    />
  );
}
