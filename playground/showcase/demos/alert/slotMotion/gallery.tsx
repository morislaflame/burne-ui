import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { AlertMotionTitleLiftDemo } from "./AlertMotionTitleLift.demo";
import alertMotionTitleLiftSource from "./AlertMotionTitleLift.demo.tsx?raw";
import { AlertMotionCompoundTitleDemo } from "./AlertMotionCompoundTitle.demo";
import alertMotionCompoundTitleSource from "./AlertMotionCompoundTitle.demo.tsx?raw";
import { AlertMotionOrchestratedDemo } from "./AlertMotionOrchestrated.demo";
import alertMotionOrchestratedSource from "./AlertMotionOrchestrated.demo.tsx?raw";
import { AlertMotionTitleColorDemo } from "./AlertMotionTitleColor.demo";
import alertMotionTitleColorSource from "./AlertMotionTitleColor.demo.tsx?raw";
import { AlertMotionPerPartDemo } from "./AlertMotionPerPart.demo";
import alertMotionPerPartSource from "./AlertMotionPerPart.demo.tsx?raw";
import { AlertMotionTimelineDemo } from "./AlertMotionTimeline.demo";
import alertMotionTimelineSource from "./AlertMotionTimeline.demo.tsx?raw";
import { AlertMotionTiltDemo } from "./AlertMotionTilt.demo";
import alertMotionTiltSource from "./AlertMotionTilt.demo.tsx?raw";

export const alertSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "title-lift", title: "Title lift", Demo: AlertMotionTitleLiftDemo, source: alertMotionTitleLiftSource },
  { id: "compound-title", title: "Compound title", Demo: AlertMotionCompoundTitleDemo, source: alertMotionCompoundTitleSource },
  { id: "orchestrated", title: "Orchestrated", Demo: AlertMotionOrchestratedDemo, source: alertMotionOrchestratedSource },
  { id: "title-color", title: "Title color", Demo: AlertMotionTitleColorDemo, source: alertMotionTitleColorSource },
  { id: "per-part", title: "Per part", Demo: AlertMotionPerPartDemo, source: alertMotionPerPartSource },
  { id: "timeline", title: "Timeline", Demo: AlertMotionTimelineDemo, source: alertMotionTimelineSource },
  { id: "tilt", title: "Tilt", Demo: AlertMotionTiltDemo, source: alertMotionTiltSource },
];

export function AlertSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Alert Slot motion demos"
      align="stretch"
      items={alertSlotMotionGallery}
    />
  );
}
