import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { HeaderMotionControllerDemo } from "./PlayRoot.demo";
import playRootSource from "./PlayRoot.demo.tsx?raw";
import { HeaderMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { HeaderMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";
import { HeaderMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";

export const headerMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-root", title: "play / set", Demo: HeaderMotionControllerDemo, source: playRootSource },
  { id: "events-ping", title: "events yoyo", Demo: HeaderMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-off", title: "events false", Demo: HeaderMotionEventsOffDemo, source: eventsOffSource },
  { id: "events-finished", title: "waitForComplete", Demo: HeaderMotionEventsFinishedDemo, source: eventsFinishedSource },
];

export function HeaderMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Header MotionController demos"
      align="stretch"
      items={headerMotionControllerGallery}
    />
  );
}
