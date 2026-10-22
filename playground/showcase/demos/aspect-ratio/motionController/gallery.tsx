import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { AspectRatioMotionControllerDemo } from "./PlayRoot.demo";
import playRootSource from "./PlayRoot.demo.tsx?raw";
import { AspectRatioMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { AspectRatioMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";
import { AspectRatioMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";

export const aspectratioMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-root", title: "play / set", Demo: AspectRatioMotionControllerDemo, source: playRootSource },
  { id: "events-ping", title: "events yoyo", Demo: AspectRatioMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-off", title: "events false", Demo: AspectRatioMotionEventsOffDemo, source: eventsOffSource },
  { id: "events-finished", title: "waitForComplete", Demo: AspectRatioMotionEventsFinishedDemo, source: eventsFinishedSource },
];

export function AspectRatioMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="AspectRatio MotionController demos"
      align="stretch"
      items={aspectratioMotionControllerGallery}
    />
  );
}
