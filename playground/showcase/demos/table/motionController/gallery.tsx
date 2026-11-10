import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { TableMotionControllerCancelDemo } from "./Cancel.demo";
import cancelSource from "./Cancel.demo.tsx?raw";
import { TableMotionControllerExcludeDemo } from "./Exclude.demo";
import excludeSource from "./Exclude.demo.tsx?raw";
import { TableMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { TableMotionEventsKickDemo } from "./EventsKick.demo";
import eventsKickSource from "./EventsKick.demo.tsx?raw";
import { TableMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";
import { TableMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { TableMotionControllerInsideDemo } from "./Inside.demo";
import insideSource from "./Inside.demo.tsx?raw";
import { TableMotionControllerDemo } from "./PlayRoot.demo";
import playRootSource from "./PlayRoot.demo.tsx?raw";
import { TableMotionControllerPlayRowDemo } from "./PlayRow.demo";
import playRowSource from "./PlayRow.demo.tsx?raw";
import { TableMotionControllerPlayVsSlotDemo } from "./PlayVsSlot.demo";
import playVsSlotSource from "./PlayVsSlot.demo.tsx?raw";
import { TableMotionControllerStaggerDemo } from "./Stagger.demo";
import staggerSource from "./Stagger.demo.tsx?raw";

export const tableMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-root", title: "play / set", Demo: TableMotionControllerDemo, source: playRootSource },
  { id: "play-vs-slot", title: "play vs playSlot", Demo: TableMotionControllerPlayVsSlotDemo, source: playVsSlotSource },
  { id: "stagger", title: "playAll columns", Demo: TableMotionControllerStaggerDemo, source: staggerSource },
  { id: "play-row", title: "playSlot(row)", Demo: TableMotionControllerPlayRowDemo, source: playRowSource },
  { id: "exclude", title: "exclude header", Demo: TableMotionControllerExcludeDemo, source: excludeSource },
  { id: "inside", title: "inside tree", Demo: TableMotionControllerInsideDemo, source: insideSource },
  { id: "cancel", title: "cancel loop", Demo: TableMotionControllerCancelDemo, source: cancelSource },
  { id: "events-ping", title: "events yoyo", Demo: TableMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-kick", title: "table:scan targets", Demo: TableMotionEventsKickDemo, source: eventsKickSource },
  { id: "events-finished", title: "waitForComplete", Demo: TableMotionEventsFinishedDemo, source: eventsFinishedSource },
  { id: "events-off", title: "events false", Demo: TableMotionEventsOffDemo, source: eventsOffSource },
];

export function TableMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Table MotionController demos"
      align="stretch"
      items={tableMotionControllerGallery}
    />
  );
}
