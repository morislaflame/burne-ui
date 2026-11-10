import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { ToastMotionControllerDemo } from "./PlayPanel.demo";
import playPanelSource from "./PlayPanel.demo.tsx?raw";
import { ToastMotionControllerPlayVsSlotDemo } from "./PlayVsSlot.demo";
import playVsSlotSource from "./PlayVsSlot.demo.tsx?raw";
import { ToastMotionControllerStaggerDemo } from "./Stagger.demo";
import staggerSource from "./Stagger.demo.tsx?raw";
import { ToastMotionControllerExcludeDemo } from "./Exclude.demo";
import excludeSource from "./Exclude.demo.tsx?raw";
import { ToastMotionControllerInsideDemo } from "./Inside.demo";
import insideSource from "./Inside.demo.tsx?raw";
import { ToastMotionControllerCancelDemo } from "./Cancel.demo";
import cancelSource from "./Cancel.demo.tsx?raw";
import { ToastMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { ToastMotionEventsKickDemo } from "./EventsKick.demo";
import eventsKickSource from "./EventsKick.demo.tsx?raw";
import { ToastMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { ToastMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";

export const toastMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-panel", title: "playSlot / set", Demo: ToastMotionControllerDemo, source: playPanelSource },
  { id: "play-vs-slot", title: "playSlot vs playAll", Demo: ToastMotionControllerPlayVsSlotDemo, source: playVsSlotSource },
  { id: "stagger", title: "playAll stagger", Demo: ToastMotionControllerStaggerDemo, source: staggerSource },
  { id: "exclude", title: "exclude title", Demo: ToastMotionControllerExcludeDemo, source: excludeSource },
  { id: "inside", title: "inside tree", Demo: ToastMotionControllerInsideDemo, source: insideSource },
  { id: "cancel", title: "cancel loop", Demo: ToastMotionControllerCancelDemo, source: cancelSource },
  { id: "events-ping", title: "events yoyo", Demo: ToastMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-kick", title: "kick targets", Demo: ToastMotionEventsKickDemo, source: eventsKickSource },
  { id: "events-finished", title: "waitForComplete", Demo: ToastMotionEventsFinishedDemo, source: eventsFinishedSource },
  { id: "events-off", title: "events false", Demo: ToastMotionEventsOffDemo, source: eventsOffSource },
];

export function ToastMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Toast MotionController demos"
      align="stretch"
      items={toastMotionControllerGallery}
    />
  );
}
