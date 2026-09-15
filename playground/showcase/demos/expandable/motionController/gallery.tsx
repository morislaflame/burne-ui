import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { ExpandableMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { ExpandableMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { ExpandableMotionEventsTimelineDemo } from "./EventsTimeline.demo";
import eventsTimelineSource from "./EventsTimeline.demo.tsx?raw";
import { ExpandableMotionControllerDemo } from "./PlayTitle.demo";
import playTitleSource from "./PlayTitle.demo.tsx?raw";
import { ExpandableMotionControllerPlayBodyDemo } from "./PlayBody.demo";
import playBodySource from "./PlayBody.demo.tsx?raw";
import { ExpandableMotionControllerStaggerDemo } from "./Stagger.demo";
import staggerSource from "./Stagger.demo.tsx?raw";

export const expandableMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-title", title: "playSlot title", Demo: ExpandableMotionControllerDemo, source: playTitleSource },
  { id: "play-body", title: "playSlot body", Demo: ExpandableMotionControllerPlayBodyDemo, source: playBodySource },
  { id: "stagger", title: "playAll stagger", Demo: ExpandableMotionControllerStaggerDemo, source: staggerSource },
  { id: "events-ping", title: "events yoyo", Demo: ExpandableMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-timeline", title: "timeline", Demo: ExpandableMotionEventsTimelineDemo, source: eventsTimelineSource },
  { id: "events-finished", title: "waitForComplete", Demo: ExpandableMotionEventsFinishedDemo, source: eventsFinishedSource },
];

export function ExpandableMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Expandable MotionController demos"
      items={expandableMotionControllerGallery}
    />
  );
}
