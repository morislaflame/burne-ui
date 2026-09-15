import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { DisclosureMotionInstantPanelDemo } from "./DisclosureMotionInstantPanel.demo";
import disclosureMotionInstantPanelSource from "./DisclosureMotionInstantPanel.demo.tsx?raw";
import { DisclosureMotionBodyDemo } from "./DisclosureMotionBody.demo";
import disclosureMotionBodySource from "./DisclosureMotionBody.demo.tsx?raw";
import { DisclosureMotionTitleDemo } from "./DisclosureMotionTitle.demo";
import disclosureMotionTitleSource from "./DisclosureMotionTitle.demo.tsx?raw";
import { DisclosureMotionTitleLiftTiltDemo } from "./DisclosureMotionTitleLiftTilt.demo";
import disclosureMotionTitleLiftTiltSource from "./DisclosureMotionTitleLiftTilt.demo.tsx?raw";
import { DisclosureMotionTitleLiftQuietDemo } from "./DisclosureMotionTitleLiftQuiet.demo";
import disclosureMotionTitleLiftQuietSource from "./DisclosureMotionTitleLiftQuiet.demo.tsx?raw";
import { DisclosureMotionChevronDemo } from "./DisclosureMotionChevron.demo";
import disclosureMotionChevronSource from "./DisclosureMotionChevron.demo.tsx?raw";
import { DisclosureMotionGroupChevronDemo } from "./DisclosureMotionGroupChevron.demo";
import disclosureMotionGroupChevronSource from "./DisclosureMotionGroupChevron.demo.tsx?raw";

export const disclosureSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "instant-panel", title: "Instant panel", Demo: DisclosureMotionInstantPanelDemo, source: disclosureMotionInstantPanelSource },
  { id: "body", title: "Body", Demo: DisclosureMotionBodyDemo, source: disclosureMotionBodySource },
  { id: "title", title: "Title", Demo: DisclosureMotionTitleDemo, source: disclosureMotionTitleSource },
  { id: "title-lift-tilt", title: "Title lift tilt", Demo: DisclosureMotionTitleLiftTiltDemo, source: disclosureMotionTitleLiftTiltSource },
  { id: "title-lift-quiet", title: "Title lift quiet", Demo: DisclosureMotionTitleLiftQuietDemo, source: disclosureMotionTitleLiftQuietSource },
  { id: "chevron", title: "Chevron", Demo: DisclosureMotionChevronDemo, source: disclosureMotionChevronSource },
  { id: "group-chevron", title: "Group chevron", Demo: DisclosureMotionGroupChevronDemo, source: disclosureMotionGroupChevronSource },
];

export function DisclosureSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Disclosure Slot motion demos"
      align="stretch"
      items={disclosureSlotMotionGallery}
    />
  );
}
