import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { ProgressBarMotionControllerCancelDemo } from "./Cancel.demo";
import cancelSource from "./Cancel.demo.tsx?raw";
import { ProgressBarMotionControllerExcludeDemo } from "./Exclude.demo";
import excludeSource from "./Exclude.demo.tsx?raw";
import { ProgressBarMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { ProgressBarMotionEventsKickDemo } from "./EventsKick.demo";
import eventsKickSource from "./EventsKick.demo.tsx?raw";
import { ProgressBarMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";
import { ProgressBarMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { ProgressBarMotionControllerInsideDemo } from "./Inside.demo";
import insideSource from "./Inside.demo.tsx?raw";
import { ProgressBarMotionControllerDemo } from "./PlayTrack.demo";
import playTrackSource from "./PlayTrack.demo.tsx?raw";
import { ProgressBarMotionControllerPlayValueDemo } from "./PlayValue.demo";
import playValueSource from "./PlayValue.demo.tsx?raw";
import { ProgressBarMotionControllerPlayVsSlotDemo } from "./PlayVsSlot.demo";
import playVsSlotSource from "./PlayVsSlot.demo.tsx?raw";
import { ProgressBarMotionControllerStaggerDemo } from "./Stagger.demo";
import staggerSource from "./Stagger.demo.tsx?raw";

export const progressBarMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-track", title: "playSlot / set", Demo: ProgressBarMotionControllerDemo, source: playTrackSource },
  { id: "play-vs-slot", title: "playSlot vs playAll", Demo: ProgressBarMotionControllerPlayVsSlotDemo, source: playVsSlotSource },
  { id: "play-value", title: "chrome value", Demo: ProgressBarMotionControllerPlayValueDemo, source: playValueSource },
  { id: "stagger", title: "playAll stagger", Demo: ProgressBarMotionControllerStaggerDemo, source: staggerSource },
  { id: "exclude", title: "playAll exclude", Demo: ProgressBarMotionControllerExcludeDemo, source: excludeSource },
  { id: "inside", title: "inside tree", Demo: ProgressBarMotionControllerInsideDemo, source: insideSource },
  { id: "cancel", title: "cancel loop", Demo: ProgressBarMotionControllerCancelDemo, source: cancelSource },
  { id: "events-ping", title: "events yoyo", Demo: ProgressBarMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-kick", title: "progress:kick targets", Demo: ProgressBarMotionEventsKickDemo, source: eventsKickSource },
  { id: "events-finished", title: "waitForComplete", Demo: ProgressBarMotionEventsFinishedDemo, source: eventsFinishedSource },
  { id: "events-off", title: "events false", Demo: ProgressBarMotionEventsOffDemo, source: eventsOffSource },
];

export function ProgressBarMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="ProgressBar MotionController demos"
      align="stretch"
      items={progressBarMotionControllerGallery}
    />
  );
}
