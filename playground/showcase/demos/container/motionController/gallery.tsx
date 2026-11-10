import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { ContainerMotionControllerDemo } from "./PlayRoot.demo";
import playRootSource from "./PlayRoot.demo.tsx?raw";
import { ContainerMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { ContainerMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";
import { ContainerMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";

export const containerMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-root", title: "play / set", Demo: ContainerMotionControllerDemo, source: playRootSource },
  { id: "events-ping", title: "events yoyo", Demo: ContainerMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-off", title: "events false", Demo: ContainerMotionEventsOffDemo, source: eventsOffSource },
  { id: "events-finished", title: "waitForComplete", Demo: ContainerMotionEventsFinishedDemo, source: eventsFinishedSource },
];

export function ContainerMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Container MotionController demos"
      align="stretch"
      items={containerMotionControllerGallery}
    />
  );
}
