import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { FieldMotionControllerCancelDemo } from "./Cancel.demo";
import cancelSource from "./Cancel.demo.tsx?raw";
import { FieldMotionControllerExcludeDemo } from "./Exclude.demo";
import excludeSource from "./Exclude.demo.tsx?raw";
import { FieldMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { FieldMotionEventsKickDemo } from "./EventsKick.demo";
import eventsKickSource from "./EventsKick.demo.tsx?raw";
import { FieldMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";
import { FieldMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { FieldMotionControllerInsideDemo } from "./Inside.demo";
import insideSource from "./Inside.demo.tsx?raw";
import { FieldMotionControllerDemo } from "./PlayRoot.demo";
import playRootSource from "./PlayRoot.demo.tsx?raw";
import { FieldMotionControllerPlaySetDemo } from "./PlaySet.demo";
import playSetSource from "./PlaySet.demo.tsx?raw";
import { FieldMotionControllerPlayVsSlotDemo } from "./PlayVsSlot.demo";
import playVsSlotSource from "./PlayVsSlot.demo.tsx?raw";
import { FieldMotionControllerStaggerDemo } from "./Stagger.demo";
import staggerSource from "./Stagger.demo.tsx?raw";

export const fieldMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-root", title: "play / set", Demo: FieldMotionControllerDemo, source: playRootSource },
  { id: "play-vs-slot", title: "play vs playSlot", Demo: FieldMotionControllerPlayVsSlotDemo, source: playVsSlotSource },
  { id: "play-set", title: "Field.Set scope", Demo: FieldMotionControllerPlaySetDemo, source: playSetSource },
  { id: "stagger", title: "playAll stagger", Demo: FieldMotionControllerStaggerDemo, source: staggerSource },
  { id: "exclude", title: "exclude hint", Demo: FieldMotionControllerExcludeDemo, source: excludeSource },
  { id: "inside", title: "inside tree", Demo: FieldMotionControllerInsideDemo, source: insideSource },
  { id: "cancel", title: "cancel loop", Demo: FieldMotionControllerCancelDemo, source: cancelSource },
  { id: "events-ping", title: "events yoyo", Demo: FieldMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-kick", title: "field:kick targets", Demo: FieldMotionEventsKickDemo, source: eventsKickSource },
  { id: "events-finished", title: "waitForComplete", Demo: FieldMotionEventsFinishedDemo, source: eventsFinishedSource },
  { id: "events-off", title: "events false", Demo: FieldMotionEventsOffDemo, source: eventsOffSource },
];

export function FieldMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Field MotionController demos"
      align="stretch"
      items={fieldMotionControllerGallery}
    />
  );
}
