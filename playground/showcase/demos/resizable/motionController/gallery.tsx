import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { ResizableMotionControllerDemo } from "./PlayRoot.demo";
import playRootSource from "./PlayRoot.demo.tsx?raw";
import { ResizableMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { ResizableMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";
import { ResizableMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";

export const resizableMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-root", title: "play / set", Demo: ResizableMotionControllerDemo, source: playRootSource },
  { id: "events-ping", title: "events yoyo", Demo: ResizableMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-off", title: "events false", Demo: ResizableMotionEventsOffDemo, source: eventsOffSource },
  { id: "events-finished", title: "waitForComplete", Demo: ResizableMotionEventsFinishedDemo, source: eventsFinishedSource },
];

export function ResizableMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Resizable MotionController demos"
      align="stretch"
      items={resizableMotionControllerGallery}
    />
  );
}
