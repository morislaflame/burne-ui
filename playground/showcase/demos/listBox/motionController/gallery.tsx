import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { ListBoxMotionControllerCancelDemo } from "./Cancel.demo";
import cancelSource from "./Cancel.demo.tsx?raw";
import { ListBoxMotionControllerExcludeDemo } from "./Exclude.demo";
import excludeSource from "./Exclude.demo.tsx?raw";
import { ListBoxMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { ListBoxMotionEventsKickDemo } from "./EventsKick.demo";
import eventsKickSource from "./EventsKick.demo.tsx?raw";
import { ListBoxMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";
import { ListBoxMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { ListBoxMotionControllerInsideDemo } from "./Inside.demo";
import insideSource from "./Inside.demo.tsx?raw";
import { ListBoxMotionControllerDemo } from "./PlayHeader.demo";
import playHeaderSource from "./PlayHeader.demo.tsx?raw";
import { ListBoxMotionControllerPlayItemDemo } from "./PlayItem.demo";
import playItemSource from "./PlayItem.demo.tsx?raw";
import { ListBoxMotionControllerPlayVsSlotDemo } from "./PlayVsSlot.demo";
import playVsSlotSource from "./PlayVsSlot.demo.tsx?raw";
import { ListBoxMotionControllerStaggerDemo } from "./Stagger.demo";
import staggerSource from "./Stagger.demo.tsx?raw";

export const listBoxMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-header", title: "playSlot header", Demo: ListBoxMotionControllerDemo, source: playHeaderSource },
  { id: "play-vs-slot", title: "play vs playSlot", Demo: ListBoxMotionControllerPlayVsSlotDemo, source: playVsSlotSource },
  { id: "stagger", title: "playAll headers", Demo: ListBoxMotionControllerStaggerDemo, source: staggerSource },
  { id: "play-item", title: "playSlot(item)", Demo: ListBoxMotionControllerPlayItemDemo, source: playItemSource },
  { id: "exclude", title: "exclude empty", Demo: ListBoxMotionControllerExcludeDemo, source: excludeSource },
  { id: "inside", title: "inside tree", Demo: ListBoxMotionControllerInsideDemo, source: insideSource },
  { id: "cancel", title: "cancel loop", Demo: ListBoxMotionControllerCancelDemo, source: cancelSource },
  { id: "events-ping", title: "events yoyo", Demo: ListBoxMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-kick", title: "listbox:scan targets", Demo: ListBoxMotionEventsKickDemo, source: eventsKickSource },
  { id: "events-finished", title: "waitForComplete", Demo: ListBoxMotionEventsFinishedDemo, source: eventsFinishedSource },
  { id: "events-off", title: "events false", Demo: ListBoxMotionEventsOffDemo, source: eventsOffSource },
];

export function ListBoxMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="ListBox MotionController demos"
      align="stretch"
      items={listBoxMotionControllerGallery}
    />
  );
}
