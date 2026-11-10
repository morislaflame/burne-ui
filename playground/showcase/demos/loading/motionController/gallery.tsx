import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { LoadingMotionControllerCancelDemo } from "./Cancel.demo";
import cancelSource from "./Cancel.demo.tsx?raw";
import { LoadingMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { LoadingMotionEventsKickDemo } from "./EventsKick.demo";
import eventsKickSource from "./EventsKick.demo.tsx?raw";
import { LoadingMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";
import { LoadingMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { LoadingMotionControllerDemo } from "./PlayRoot.demo";
import playRootSource from "./PlayRoot.demo.tsx?raw";
import { LoadingMotionControllerPlayVsSlotDemo } from "./PlayVsSlot.demo";
import playVsSlotSource from "./PlayVsSlot.demo.tsx?raw";
import { LoadingMotionControllerSignalDemo } from "./Signal.demo";
import signalSource from "./Signal.demo.tsx?raw";
import { LoadingMotionControllerStaggerDemo } from "./Stagger.demo";
import staggerSource from "./Stagger.demo.tsx?raw";

export const loadingMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-root", title: "playSlot / set", Demo: LoadingMotionControllerDemo, source: playRootSource },
  { id: "play-vs-slot", title: "play vs playSlot", Demo: LoadingMotionControllerPlayVsSlotDemo, source: playVsSlotSource },
  { id: "stagger", title: "playAll stagger", Demo: LoadingMotionControllerStaggerDemo, source: staggerSource },
  { id: "cancel", title: "cancel loop", Demo: LoadingMotionControllerCancelDemo, source: cancelSource },
  { id: "signal", title: "AbortSignal", Demo: LoadingMotionControllerSignalDemo, source: signalSource },
  { id: "events-ping", title: "events yoyo", Demo: LoadingMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-kick", title: "load:kick targets", Demo: LoadingMotionEventsKickDemo, source: eventsKickSource },
  { id: "events-finished", title: "waitForComplete", Demo: LoadingMotionEventsFinishedDemo, source: eventsFinishedSource },
  { id: "events-off", title: "events false", Demo: LoadingMotionEventsOffDemo, source: eventsOffSource },
];

export function LoadingMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Loading MotionController demos"
      items={loadingMotionControllerGallery}
    />
  );
}
