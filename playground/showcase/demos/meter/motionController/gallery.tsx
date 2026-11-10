import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { MeterMotionControllerCancelDemo } from "./Cancel.demo";
import cancelSource from "./Cancel.demo.tsx?raw";
import { MeterMotionControllerExcludeDemo } from "./Exclude.demo";
import excludeSource from "./Exclude.demo.tsx?raw";
import { MeterMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { MeterMotionEventsKickDemo } from "./EventsKick.demo";
import eventsKickSource from "./EventsKick.demo.tsx?raw";
import { MeterMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";
import { MeterMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { MeterMotionControllerInsideDemo } from "./Inside.demo";
import insideSource from "./Inside.demo.tsx?raw";
import { MeterMotionControllerDemo } from "./PlayTrack.demo";
import playTrackSource from "./PlayTrack.demo.tsx?raw";
import { MeterMotionControllerPlayValueDemo } from "./PlayValue.demo";
import playValueSource from "./PlayValue.demo.tsx?raw";
import { MeterMotionControllerPlayVsSlotDemo } from "./PlayVsSlot.demo";
import playVsSlotSource from "./PlayVsSlot.demo.tsx?raw";
import { MeterMotionControllerStaggerDemo } from "./Stagger.demo";
import staggerSource from "./Stagger.demo.tsx?raw";

export const meterMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-track", title: "playSlot / set", Demo: MeterMotionControllerDemo, source: playTrackSource },
  { id: "play-vs-slot", title: "playSlot vs playAll", Demo: MeterMotionControllerPlayVsSlotDemo, source: playVsSlotSource },
  { id: "play-value", title: "chrome value", Demo: MeterMotionControllerPlayValueDemo, source: playValueSource },
  { id: "stagger", title: "playAll stagger", Demo: MeterMotionControllerStaggerDemo, source: staggerSource },
  { id: "exclude", title: "playAll exclude", Demo: MeterMotionControllerExcludeDemo, source: excludeSource },
  { id: "inside", title: "inside tree", Demo: MeterMotionControllerInsideDemo, source: insideSource },
  { id: "cancel", title: "cancel loop", Demo: MeterMotionControllerCancelDemo, source: cancelSource },
  { id: "events-ping", title: "events yoyo", Demo: MeterMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-kick", title: "meter:kick targets", Demo: MeterMotionEventsKickDemo, source: eventsKickSource },
  { id: "events-finished", title: "waitForComplete", Demo: MeterMotionEventsFinishedDemo, source: eventsFinishedSource },
  { id: "events-off", title: "events false", Demo: MeterMotionEventsOffDemo, source: eventsOffSource },
];

export function MeterMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Meter MotionController demos"
      align="stretch"
      items={meterMotionControllerGallery}
    />
  );
}
