import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { GridMotionControllerDemo } from "./PlayRoot.demo";
import playRootSource from "./PlayRoot.demo.tsx?raw";
import { GridMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { GridMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";
import { GridMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";

export const gridMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-root", title: "play / set", Demo: GridMotionControllerDemo, source: playRootSource },
  { id: "events-ping", title: "events yoyo", Demo: GridMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-off", title: "events false", Demo: GridMotionEventsOffDemo, source: eventsOffSource },
  { id: "events-finished", title: "waitForComplete", Demo: GridMotionEventsFinishedDemo, source: eventsFinishedSource },
];

export function GridMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Grid MotionController demos"
      align="stretch"
      items={gridMotionControllerGallery}
    />
  );
}
