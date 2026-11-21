import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { FormMotionControllerCancelDemo } from "./Cancel.demo";
import cancelSource from "./Cancel.demo.tsx?raw";
import { FormMotionControllerExcludeDemo } from "./Exclude.demo";
import excludeSource from "./Exclude.demo.tsx?raw";
import { FormMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { FormMotionEventsKickDemo } from "./EventsKick.demo";
import eventsKickSource from "./EventsKick.demo.tsx?raw";
import { FormMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";
import { FormMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { FormMotionControllerInsideDemo } from "./Inside.demo";
import insideSource from "./Inside.demo.tsx?raw";
import { FormMotionControllerPlayFieldDemo } from "./PlayField.demo";
import playFieldSource from "./PlayField.demo.tsx?raw";
import { FormMotionControllerDemo } from "./PlayRoot.demo";
import playRootSource from "./PlayRoot.demo.tsx?raw";
import { FormMotionControllerPlayVsSlotDemo } from "./PlayVsSlot.demo";
import playVsSlotSource from "./PlayVsSlot.demo.tsx?raw";
import { FormMotionControllerStaggerDemo } from "./Stagger.demo";
import staggerSource from "./Stagger.demo.tsx?raw";

export const formMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-root", title: "play / set", Demo: FormMotionControllerDemo, source: playRootSource },
  { id: "play-vs-slot", title: "play vs playSlot", Demo: FormMotionControllerPlayVsSlotDemo, source: playVsSlotSource },
  { id: "play-field", title: "Form.Field scope", Demo: FormMotionControllerPlayFieldDemo, source: playFieldSource },
  { id: "stagger", title: "playAll stagger", Demo: FormMotionControllerStaggerDemo, source: staggerSource },
  { id: "exclude", title: "exclude title", Demo: FormMotionControllerExcludeDemo, source: excludeSource },
  { id: "inside", title: "inside tree", Demo: FormMotionControllerInsideDemo, source: insideSource },
  { id: "cancel", title: "cancel loop", Demo: FormMotionControllerCancelDemo, source: cancelSource },
  { id: "events-ping", title: "events yoyo", Demo: FormMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-kick", title: "form:kick targets", Demo: FormMotionEventsKickDemo, source: eventsKickSource },
  { id: "events-finished", title: "waitForComplete", Demo: FormMotionEventsFinishedDemo, source: eventsFinishedSource },
  { id: "events-off", title: "events false", Demo: FormMotionEventsOffDemo, source: eventsOffSource },
];

export function FormMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Form MotionController demos"
      align="stretch"
      items={formMotionControllerGallery}
    />
  );
}
