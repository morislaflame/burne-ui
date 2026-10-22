import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { StackMotionControllerDemo } from "./PlayRoot.demo";
import playRootSource from "./PlayRoot.demo.tsx?raw";
import { StackMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { StackMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";
import { StackMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";

export const stackMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-root", title: "play / set", Demo: StackMotionControllerDemo, source: playRootSource },
  { id: "events-ping", title: "events yoyo", Demo: StackMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-off", title: "events false", Demo: StackMotionEventsOffDemo, source: eventsOffSource },
  { id: "events-finished", title: "waitForComplete", Demo: StackMotionEventsFinishedDemo, source: eventsFinishedSource },
];

export function StackMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Stack MotionController demos"
      align="stretch"
      items={stackMotionControllerGallery}
    />
  );
}
