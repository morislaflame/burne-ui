import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { TooltipMotionControllerDemo } from "./PlayPanel.demo";
import playPanelSource from "./PlayPanel.demo.tsx?raw";
import { TooltipMotionControllerPlayVsSlotDemo } from "./PlayVsSlot.demo";
import playVsSlotSource from "./PlayVsSlot.demo.tsx?raw";
import { TooltipMotionControllerStaggerDemo } from "./Stagger.demo";
import staggerSource from "./Stagger.demo.tsx?raw";
import { TooltipMotionControllerExcludeDemo } from "./Exclude.demo";
import excludeSource from "./Exclude.demo.tsx?raw";
import { TooltipMotionControllerInsideDemo } from "./Inside.demo";
import insideSource from "./Inside.demo.tsx?raw";
import { TooltipMotionControllerCancelDemo } from "./Cancel.demo";
import cancelSource from "./Cancel.demo.tsx?raw";
import { TooltipMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { TooltipMotionEventsKickDemo } from "./EventsKick.demo";
import eventsKickSource from "./EventsKick.demo.tsx?raw";
import { TooltipMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { TooltipMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";

export const tooltipMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-panel", title: "playSlot / set", Demo: TooltipMotionControllerDemo, source: playPanelSource },
  { id: "play-vs-slot", title: "playSlot vs playAll", Demo: TooltipMotionControllerPlayVsSlotDemo, source: playVsSlotSource },
  { id: "stagger", title: "playAll stagger", Demo: TooltipMotionControllerStaggerDemo, source: staggerSource },
  { id: "exclude", title: "exclude title", Demo: TooltipMotionControllerExcludeDemo, source: excludeSource },
  { id: "inside", title: "inside tree", Demo: TooltipMotionControllerInsideDemo, source: insideSource },
  { id: "cancel", title: "cancel loop", Demo: TooltipMotionControllerCancelDemo, source: cancelSource },
  { id: "events-ping", title: "events yoyo", Demo: TooltipMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-kick", title: "kick targets", Demo: TooltipMotionEventsKickDemo, source: eventsKickSource },
  { id: "events-finished", title: "waitForComplete", Demo: TooltipMotionEventsFinishedDemo, source: eventsFinishedSource },
  { id: "events-off", title: "events false", Demo: TooltipMotionEventsOffDemo, source: eventsOffSource },
];

export function TooltipMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Tooltip MotionController demos"
      align="stretch"
      items={tooltipMotionControllerGallery}
    />
  );
}
