import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { SeparatorMotionControllerCancelDemo } from "./Cancel.demo";
import cancelSource from "./Cancel.demo.tsx?raw";
import { SeparatorMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { SeparatorMotionEventsKickDemo } from "./EventsKick.demo";
import eventsKickSource from "./EventsKick.demo.tsx?raw";
import { SeparatorMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";
import { SeparatorMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { SeparatorMotionControllerDemo } from "./PlayRoot.demo";
import playRootSource from "./PlayRoot.demo.tsx?raw";

export const separatorMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-root", title: "play / set", Demo: SeparatorMotionControllerDemo, source: playRootSource },
  { id: "cancel", title: "cancel loop", Demo: SeparatorMotionControllerCancelDemo, source: cancelSource },
  { id: "events-ping", title: "events yoyo", Demo: SeparatorMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-kick", title: "sep:kick timeline", Demo: SeparatorMotionEventsKickDemo, source: eventsKickSource },
  { id: "events-finished", title: "waitForComplete", Demo: SeparatorMotionEventsFinishedDemo, source: eventsFinishedSource },
  { id: "events-off", title: "events false", Demo: SeparatorMotionEventsOffDemo, source: eventsOffSource },
];

export function SeparatorMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Separator MotionController demos"
      align="stretch"
      items={separatorMotionControllerGallery}
    />
  );
}
