import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { CalendarMotionControllerCancelDemo } from "./Cancel.demo";
import cancelSource from "./Cancel.demo.tsx?raw";
import { CalendarMotionControllerExcludeDemo } from "./Exclude.demo";
import excludeSource from "./Exclude.demo.tsx?raw";
import { CalendarMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { CalendarMotionEventsKickDemo } from "./EventsKick.demo";
import eventsKickSource from "./EventsKick.demo.tsx?raw";
import { CalendarMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";
import { CalendarMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { CalendarMotionControllerInsideDemo } from "./Inside.demo";
import insideSource from "./Inside.demo.tsx?raw";
import { CalendarMotionControllerPlayCellDemo } from "./PlayCell.demo";
import playCellSource from "./PlayCell.demo.tsx?raw";
import { CalendarMotionControllerDemo } from "./PlayHeader.demo";
import playHeaderSource from "./PlayHeader.demo.tsx?raw";
import { CalendarMotionControllerPlayVsSlotDemo } from "./PlayVsSlot.demo";
import playVsSlotSource from "./PlayVsSlot.demo.tsx?raw";
import { CalendarMotionControllerStaggerDemo } from "./Stagger.demo";
import staggerSource from "./Stagger.demo.tsx?raw";

export const calendarMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-header", title: "playSlot header", Demo: CalendarMotionControllerDemo, source: playHeaderSource },
  { id: "play-vs-slot", title: "play vs playSlot", Demo: CalendarMotionControllerPlayVsSlotDemo, source: playVsSlotSource },
  { id: "stagger", title: "playAll chrome", Demo: CalendarMotionControllerStaggerDemo, source: staggerSource },
  { id: "play-cell", title: "playSlot(cell)", Demo: CalendarMotionControllerPlayCellDemo, source: playCellSource },
  { id: "exclude", title: "exclude header", Demo: CalendarMotionControllerExcludeDemo, source: excludeSource },
  { id: "inside", title: "inside tree", Demo: CalendarMotionControllerInsideDemo, source: insideSource },
  { id: "cancel", title: "cancel loop", Demo: CalendarMotionControllerCancelDemo, source: cancelSource },
  { id: "events-ping", title: "events yoyo", Demo: CalendarMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-kick", title: "calendar:scan targets", Demo: CalendarMotionEventsKickDemo, source: eventsKickSource },
  { id: "events-finished", title: "waitForComplete", Demo: CalendarMotionEventsFinishedDemo, source: eventsFinishedSource },
  { id: "events-off", title: "events false", Demo: CalendarMotionEventsOffDemo, source: eventsOffSource },
];

export function CalendarMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Calendar MotionController demos"
      align="stretch"
      items={calendarMotionControllerGallery}
    />
  );
}
