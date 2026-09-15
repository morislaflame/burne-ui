import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { PaginationMotionControllerCancelDemo } from "./Cancel.demo";
import cancelSource from "./Cancel.demo.tsx?raw";
import { PaginationMotionControllerExcludeDemo } from "./Exclude.demo";
import excludeSource from "./Exclude.demo.tsx?raw";
import { PaginationMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { PaginationMotionEventsKickDemo } from "./EventsKick.demo";
import eventsKickSource from "./EventsKick.demo.tsx?raw";
import { PaginationMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";
import { PaginationMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { PaginationMotionControllerInsideDemo } from "./Inside.demo";
import insideSource from "./Inside.demo.tsx?raw";
import { PaginationMotionControllerPlayControlDemo } from "./PlayControl.demo";
import playControlSource from "./PlayControl.demo.tsx?raw";
import { PaginationMotionControllerDemo } from "./PlaySummary.demo";
import playSummarySource from "./PlaySummary.demo.tsx?raw";
import { PaginationMotionControllerPlayVsSlotDemo } from "./PlayVsSlot.demo";
import playVsSlotSource from "./PlayVsSlot.demo.tsx?raw";
import { PaginationMotionControllerStaggerDemo } from "./Stagger.demo";
import staggerSource from "./Stagger.demo.tsx?raw";

export const paginationMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-summary", title: "playSlot summary", Demo: PaginationMotionControllerDemo, source: playSummarySource },
  { id: "play-vs-slot", title: "play vs playSlot", Demo: PaginationMotionControllerPlayVsSlotDemo, source: playVsSlotSource },
  { id: "stagger", title: "playAll chrome", Demo: PaginationMotionControllerStaggerDemo, source: staggerSource },
  { id: "play-control", title: "playSlot(control)", Demo: PaginationMotionControllerPlayControlDemo, source: playControlSource },
  { id: "exclude", title: "exclude summary", Demo: PaginationMotionControllerExcludeDemo, source: excludeSource },
  { id: "inside", title: "inside tree", Demo: PaginationMotionControllerInsideDemo, source: insideSource },
  { id: "cancel", title: "cancel loop", Demo: PaginationMotionControllerCancelDemo, source: cancelSource },
  { id: "events-ping", title: "events yoyo", Demo: PaginationMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-kick", title: "pagination:scan targets", Demo: PaginationMotionEventsKickDemo, source: eventsKickSource },
  { id: "events-finished", title: "waitForComplete", Demo: PaginationMotionEventsFinishedDemo, source: eventsFinishedSource },
  { id: "events-off", title: "events false", Demo: PaginationMotionEventsOffDemo, source: eventsOffSource },
];

export function PaginationMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Pagination MotionController demos"
      align="stretch"
      items={paginationMotionControllerGallery}
    />
  );
}
