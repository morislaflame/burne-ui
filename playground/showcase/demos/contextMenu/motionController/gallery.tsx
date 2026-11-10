import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { ContextMenuMotionControllerDemo } from "./PlayPanel.demo";
import playPanelSource from "./PlayPanel.demo.tsx?raw";
import { ContextMenuMotionControllerPlayVsSlotDemo } from "./PlayVsSlot.demo";
import playVsSlotSource from "./PlayVsSlot.demo.tsx?raw";
import { ContextMenuMotionControllerStaggerDemo } from "./Stagger.demo";
import staggerSource from "./Stagger.demo.tsx?raw";
import { ContextMenuMotionControllerExcludeDemo } from "./Exclude.demo";
import excludeSource from "./Exclude.demo.tsx?raw";
import { ContextMenuMotionControllerInsideDemo } from "./Inside.demo";
import insideSource from "./Inside.demo.tsx?raw";
import { ContextMenuMotionControllerCancelDemo } from "./Cancel.demo";
import cancelSource from "./Cancel.demo.tsx?raw";
import { ContextMenuMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { ContextMenuMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { ContextMenuMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";

export const contextMenuMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-panel", title: "playSlot / set", Demo: ContextMenuMotionControllerDemo, source: playPanelSource },
  { id: "play-vs-slot", title: "play vs playSlot", Demo: ContextMenuMotionControllerPlayVsSlotDemo, source: playVsSlotSource },
  { id: "stagger", title: "playAll items", Demo: ContextMenuMotionControllerStaggerDemo, source: staggerSource },
  { id: "exclude", title: "exclude content", Demo: ContextMenuMotionControllerExcludeDemo, source: excludeSource },
  { id: "inside", title: "inside tree", Demo: ContextMenuMotionControllerInsideDemo, source: insideSource },
  { id: "cancel", title: "cancel loop", Demo: ContextMenuMotionControllerCancelDemo, source: cancelSource },
  { id: "events-ping", title: "events yoyo", Demo: ContextMenuMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-finished", title: "waitForComplete", Demo: ContextMenuMotionEventsFinishedDemo, source: eventsFinishedSource },
  { id: "events-off", title: "events false", Demo: ContextMenuMotionEventsOffDemo, source: eventsOffSource },
];

export function ContextMenuMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="ContextMenu MotionController demos"
      align="stretch"
      items={contextMenuMotionControllerGallery}
    />
  );
}
