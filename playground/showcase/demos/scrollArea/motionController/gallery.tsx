import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { ScrollAreaMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { ScrollAreaMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";
import { ScrollAreaMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { ScrollAreaMotionPlayPartsDemo } from "./PlayParts.demo";
import playPartsSource from "./PlayParts.demo.tsx?raw";
import { ScrollAreaMotionPlayThumbDemo } from "./PlayThumb.demo";
import playThumbSource from "./PlayThumb.demo.tsx?raw";

export const scrollAreaMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-slot-set", title: "playSlot / set", Demo: ScrollAreaMotionPlayThumbDemo, source: playThumbSource },
  { id: "play-parts", title: "Every slot", Demo: ScrollAreaMotionPlayPartsDemo, source: playPartsSource },
  { id: "events-yoyo", title: "events yoyo", Demo: ScrollAreaMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-false", title: "events off", Demo: ScrollAreaMotionEventsOffDemo, source: eventsOffSource },
  { id: "wait", title: "run.finished", Demo: ScrollAreaMotionEventsFinishedDemo, source: eventsFinishedSource },
];

export function ScrollAreaMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="ScrollArea MotionController demos"
      align="start"
      items={scrollAreaMotionControllerGallery}
    />
  );
}
