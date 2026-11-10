import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { AlertMotionControllerCancelDemo } from "./Cancel.demo";
import cancelSource from "./Cancel.demo.tsx?raw";
import { AlertMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { AlertMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";
import { AlertMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { AlertMotionEventsSaveDemo } from "./EventsSave.demo";
import eventsSaveSource from "./EventsSave.demo.tsx?raw";
import { AlertMotionEventsTargetsDemo } from "./EventsTargets.demo";
import eventsTargetsSource from "./EventsTargets.demo.tsx?raw";
import { AlertMotionControllerExcludeDemo } from "./Exclude.demo";
import excludeSource from "./Exclude.demo.tsx?raw";
import { AlertMotionControllerInsideDemo } from "./Inside.demo";
import insideSource from "./Inside.demo.tsx?raw";
import { AlertMotionControllerDemo } from "./PlayRoot.demo";
import playRootSource from "./PlayRoot.demo.tsx?raw";
import { AlertMotionControllerPlayVsSlotDemo } from "./PlayVsSlot.demo";
import playVsSlotSource from "./PlayVsSlot.demo.tsx?raw";
import { AlertMotionControllerSignalDemo } from "./Signal.demo";
import signalSource from "./Signal.demo.tsx?raw";
import { AlertMotionControllerStaggerDemo } from "./Stagger.demo";
import staggerSource from "./Stagger.demo.tsx?raw";
import { AlertMotionStatesSaveDemo } from "./StatesSave.demo";
import statesSaveSource from "./StatesSave.demo.tsx?raw";

export const alertMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-root", title: "playSlot / set", Demo: AlertMotionControllerDemo, source: playRootSource },
  { id: "play-vs-slot", title: "play vs playSlot", Demo: AlertMotionControllerPlayVsSlotDemo, source: playVsSlotSource },
  { id: "inside", title: "useMotionController", Demo: AlertMotionControllerInsideDemo, source: insideSource },
  { id: "stagger", title: "playAll stagger", Demo: AlertMotionControllerStaggerDemo, source: staggerSource },
  { id: "exclude", title: "exclude", Demo: AlertMotionControllerExcludeDemo, source: excludeSource },
  { id: "cancel", title: "cancel", Demo: AlertMotionControllerCancelDemo, source: cancelSource },
  { id: "signal", title: "AbortSignal", Demo: AlertMotionControllerSignalDemo, source: signalSource },
  { id: "events-ping", title: "events yoyo", Demo: AlertMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-save", title: "events factory", Demo: AlertMotionEventsSaveDemo, source: eventsSaveSource },
  { id: "events-finished", title: "waitForComplete", Demo: AlertMotionEventsFinishedDemo, source: eventsFinishedSource },
  { id: "events-targets", title: "ctx.targets", Demo: AlertMotionEventsTargetsDemo, source: eventsTargetsSource },
  { id: "events-off", title: "events false", Demo: AlertMotionEventsOffDemo, source: eventsOffSource },
  { id: "states-save", title: "motionState", Demo: AlertMotionStatesSaveDemo, source: statesSaveSource },
];

export function AlertMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Alert MotionController demos"
      items={alertMotionControllerGallery}
    />
  );
}
