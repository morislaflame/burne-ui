import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { CheckboxGroupMotionControllerCancelDemo } from "./Cancel.demo";
import cancelSource from "./Cancel.demo.tsx?raw";
import { CheckboxGroupMotionControllerExcludeDemo } from "./Exclude.demo";
import excludeSource from "./Exclude.demo.tsx?raw";
import { CheckboxGroupMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { CheckboxGroupMotionEventsKickDemo } from "./EventsKick.demo";
import eventsKickSource from "./EventsKick.demo.tsx?raw";
import { CheckboxGroupMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";
import { CheckboxGroupMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { CheckboxGroupMotionControllerInsideDemo } from "./Inside.demo";
import insideSource from "./Inside.demo.tsx?raw";
import { CheckboxGroupMotionControllerDemo } from "./PlayRoot.demo";
import playRootSource from "./PlayRoot.demo.tsx?raw";
import { CheckboxGroupMotionControllerPlayVsSlotDemo } from "./PlayVsSlot.demo";
import playVsSlotSource from "./PlayVsSlot.demo.tsx?raw";
import { CheckboxGroupMotionControllerStaggerDemo } from "./Stagger.demo";
import staggerSource from "./Stagger.demo.tsx?raw";

export const checkboxGroupMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-root", title: "play / set", Demo: CheckboxGroupMotionControllerDemo, source: playRootSource },
  { id: "play-vs-slot", title: "play vs playSlot", Demo: CheckboxGroupMotionControllerPlayVsSlotDemo, source: playVsSlotSource },
  { id: "stagger", title: "playAll stagger", Demo: CheckboxGroupMotionControllerStaggerDemo, source: staggerSource },
  { id: "exclude", title: "exclude hint", Demo: CheckboxGroupMotionControllerExcludeDemo, source: excludeSource },
  { id: "inside", title: "inside tree", Demo: CheckboxGroupMotionControllerInsideDemo, source: insideSource },
  { id: "cancel", title: "cancel loop", Demo: CheckboxGroupMotionControllerCancelDemo, source: cancelSource },
  { id: "events-ping", title: "events yoyo", Demo: CheckboxGroupMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-kick", title: "checks:kick targets", Demo: CheckboxGroupMotionEventsKickDemo, source: eventsKickSource },
  { id: "events-finished", title: "waitForComplete", Demo: CheckboxGroupMotionEventsFinishedDemo, source: eventsFinishedSource },
  { id: "events-off", title: "events false", Demo: CheckboxGroupMotionEventsOffDemo, source: eventsOffSource },
];

export function CheckboxGroupMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="CheckboxGroup MotionController demos"
      align="stretch"
      items={checkboxGroupMotionControllerGallery}
    />
  );
}
