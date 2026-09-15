import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { ExpandableMotionDefaultDemo } from "./ExpandableMotionDefault.demo";
import expandableMotionDefaultSource from "./ExpandableMotionDefault.demo.tsx?raw";
import { ExpandableMotionInstantPanelDemo } from "./ExpandableMotionInstantPanel.demo";
import expandableMotionInstantPanelSource from "./ExpandableMotionInstantPanel.demo.tsx?raw";
import { ExpandableMotionChevronDemo } from "./ExpandableMotionChevron.demo";
import expandableMotionChevronSource from "./ExpandableMotionChevron.demo.tsx?raw";
import { ExpandableMotionBounceHeightDemo } from "./ExpandableMotionBounceHeight.demo";
import expandableMotionBounceHeightSource from "./ExpandableMotionBounceHeight.demo.tsx?raw";
import { ExpandableMotionClipWipeDemo } from "./ExpandableMotionClipWipe.demo";
import expandableMotionClipWipeSource from "./ExpandableMotionClipWipe.demo.tsx?raw";
import { ExpandableMotionPanelInnerDemo } from "./ExpandableMotionPanelInner.demo";
import expandableMotionPanelInnerSource from "./ExpandableMotionPanelInner.demo.tsx?raw";
import { ExpandableMotionBodyDemo } from "./ExpandableMotionBody.demo";
import expandableMotionBodySource from "./ExpandableMotionBody.demo.tsx?raw";
import { ExpandableMotionTitleColorDemo } from "./ExpandableMotionTitleColor.demo";
import expandableMotionTitleColorSource from "./ExpandableMotionTitleColor.demo.tsx?raw";

export const expandableSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "default", title: "Default", Demo: ExpandableMotionDefaultDemo, source: expandableMotionDefaultSource },
  { id: "instant-panel", title: "Instant panel", Demo: ExpandableMotionInstantPanelDemo, source: expandableMotionInstantPanelSource },
  { id: "chevron", title: "Chevron", Demo: ExpandableMotionChevronDemo, source: expandableMotionChevronSource },
  { id: "bounce-height", title: "Bounce height", Demo: ExpandableMotionBounceHeightDemo, source: expandableMotionBounceHeightSource },
  { id: "clip-wipe", title: "Clip wipe", Demo: ExpandableMotionClipWipeDemo, source: expandableMotionClipWipeSource },
  { id: "panel-inner", title: "Panel inner", Demo: ExpandableMotionPanelInnerDemo, source: expandableMotionPanelInnerSource },
  { id: "body", title: "Body", Demo: ExpandableMotionBodyDemo, source: expandableMotionBodySource },
  { id: "title-color", title: "Title color", Demo: ExpandableMotionTitleColorDemo, source: expandableMotionTitleColorSource },
];

export function ExpandableSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Expandable Slot motion demos"
      align="stretch"
      items={expandableSlotMotionGallery}
    />
  );
}
