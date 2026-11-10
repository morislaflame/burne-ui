import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { HoverCardMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { HoverCardMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";
import { HoverCardMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { HoverCardMotionInsideDemo } from "./Inside.demo";
import insideSource from "./Inside.demo.tsx?raw";
import { HoverCardMotionPlayPartsDemo } from "./PlayParts.demo";
import playPartsSource from "./PlayParts.demo.tsx?raw";
import { HoverCardMotionPlayTitleDemo } from "./PlayTitle.demo";
import playTitleSource from "./PlayTitle.demo.tsx?raw";

export const hoverCardMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-title", title: "playSlot / set", Demo: HoverCardMotionPlayTitleDemo, source: playTitleSource },
  { id: "play-parts", title: "playSlot content", Demo: HoverCardMotionPlayPartsDemo, source: playPartsSource },
  { id: "inside", title: "Inside the card", Demo: HoverCardMotionInsideDemo, source: insideSource },
  { id: "events-ping", title: "events yoyo", Demo: HoverCardMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-off", title: "events false", Demo: HoverCardMotionEventsOffDemo, source: eventsOffSource },
  { id: "events-finished", title: "waitForComplete", Demo: HoverCardMotionEventsFinishedDemo, source: eventsFinishedSource },
];

export function HoverCardMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="HoverCard MotionController demos"
      items={hoverCardMotionControllerGallery}
    />
  );
}
