import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { ColorSwatchMotionControllerDemo } from "./PlayRoot.demo";
import playrootSource from "./PlayRoot.demo.tsx?raw";
import { ColorSwatchMotionControllerCancelDemo } from "./Cancel.demo";
import cancelSource from "./Cancel.demo.tsx?raw";
import { ColorSwatchMotionEventsPingDemo } from "./EventsPing.demo";
import eventspingSource from "./EventsPing.demo.tsx?raw";
import { ColorSwatchMotionEventsTimelineDemo } from "./EventsTimeline.demo";
import eventstimelineSource from "./EventsTimeline.demo.tsx?raw";
import { ColorSwatchMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsfinishedSource from "./EventsFinished.demo.tsx?raw";
import { ColorSwatchMotionEventsOffDemo } from "./EventsOff.demo";
import eventsoffSource from "./EventsOff.demo.tsx?raw";

export const colorSwatchMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-root", title: "play / set", Demo: ColorSwatchMotionControllerDemo, source: playrootSource },
  { id: "cancel", title: "cancel loop", Demo: ColorSwatchMotionControllerCancelDemo, source: cancelSource },
  { id: "events-ping", title: "events yoyo", Demo: ColorSwatchMotionEventsPingDemo, source: eventspingSource },
  { id: "events-timeline", title: "timeline", Demo: ColorSwatchMotionEventsTimelineDemo, source: eventstimelineSource },
  { id: "events-finished", title: "waitForComplete", Demo: ColorSwatchMotionEventsFinishedDemo, source: eventsfinishedSource },
  { id: "events-off", title: "events false", Demo: ColorSwatchMotionEventsOffDemo, source: eventsoffSource },
];

export function ColorSwatchMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="ColorSwatch MotionController demos"
      align="stretch"
      items={colorSwatchMotionControllerGallery}
    />
  );
}
