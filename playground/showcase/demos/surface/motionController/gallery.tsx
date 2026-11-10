import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { SurfaceMotionControllerCancelDemo } from "./Cancel.demo";
import cancelSource from "./Cancel.demo.tsx?raw";
import { SurfaceMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { SurfaceMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { SurfaceMotionEventsTimelineDemo } from "./EventsTimeline.demo";
import eventsTimelineSource from "./EventsTimeline.demo.tsx?raw";
import { SurfaceMotionControllerDemo } from "./PlayRoot.demo";
import playRootSource from "./PlayRoot.demo.tsx?raw";

export const surfaceMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-root", title: "playSlot / set", Demo: SurfaceMotionControllerDemo, source: playRootSource },
  { id: "cancel", title: "cancel", Demo: SurfaceMotionControllerCancelDemo, source: cancelSource },
  { id: "events-ping", title: "events yoyo", Demo: SurfaceMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-timeline", title: "timeline", Demo: SurfaceMotionEventsTimelineDemo, source: eventsTimelineSource },
  { id: "events-finished", title: "waitForComplete", Demo: SurfaceMotionEventsFinishedDemo, source: eventsFinishedSource },
];

export function SurfaceMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Surface MotionController demos"
      items={surfaceMotionControllerGallery}
    />
  );
}
