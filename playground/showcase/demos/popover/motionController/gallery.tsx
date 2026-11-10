import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { PopoverMotionControllerDemo } from "./PlayPanel.demo";
import playPanelSource from "./PlayPanel.demo.tsx?raw";
import { PopoverMotionControllerPlayVsSlotDemo } from "./PlayVsSlot.demo";
import playVsSlotSource from "./PlayVsSlot.demo.tsx?raw";
import { PopoverMotionControllerStaggerDemo } from "./Stagger.demo";
import staggerSource from "./Stagger.demo.tsx?raw";
import { PopoverMotionControllerExcludeDemo } from "./Exclude.demo";
import excludeSource from "./Exclude.demo.tsx?raw";
import { PopoverMotionControllerInsideDemo } from "./Inside.demo";
import insideSource from "./Inside.demo.tsx?raw";
import { PopoverMotionControllerCancelDemo } from "./Cancel.demo";
import cancelSource from "./Cancel.demo.tsx?raw";
import { PopoverMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { PopoverMotionEventsKickDemo } from "./EventsKick.demo";
import eventsKickSource from "./EventsKick.demo.tsx?raw";
import { PopoverMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { PopoverMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";

export const popoverMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-panel", title: "playSlot / set", Demo: PopoverMotionControllerDemo, source: playPanelSource },
  { id: "play-vs-slot", title: "playSlot vs playAll", Demo: PopoverMotionControllerPlayVsSlotDemo, source: playVsSlotSource },
  { id: "stagger", title: "playAll stagger", Demo: PopoverMotionControllerStaggerDemo, source: staggerSource },
  { id: "exclude", title: "exclude title", Demo: PopoverMotionControllerExcludeDemo, source: excludeSource },
  { id: "inside", title: "inside tree", Demo: PopoverMotionControllerInsideDemo, source: insideSource },
  { id: "cancel", title: "cancel loop", Demo: PopoverMotionControllerCancelDemo, source: cancelSource },
  { id: "events-ping", title: "events yoyo", Demo: PopoverMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-kick", title: "kick targets", Demo: PopoverMotionEventsKickDemo, source: eventsKickSource },
  { id: "events-finished", title: "waitForComplete", Demo: PopoverMotionEventsFinishedDemo, source: eventsFinishedSource },
  { id: "events-off", title: "events false", Demo: PopoverMotionEventsOffDemo, source: eventsOffSource },
];

export function PopoverMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Popover MotionController demos"
      align="stretch"
      items={popoverMotionControllerGallery}
    />
  );
}
