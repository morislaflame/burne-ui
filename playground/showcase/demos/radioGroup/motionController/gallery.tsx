import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { RadioGroupMotionControllerCancelDemo } from "./Cancel.demo";
import cancelSource from "./Cancel.demo.tsx?raw";
import { RadioGroupMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { RadioGroupMotionEventsNudgeDemo } from "./EventsNudge.demo";
import eventsNudgeSource from "./EventsNudge.demo.tsx?raw";
import { RadioGroupMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";
import { RadioGroupMotionEventsPickDemo } from "./EventsPick.demo";
import eventsPickSource from "./EventsPick.demo.tsx?raw";
import { RadioGroupMotionControllerExcludeDemo } from "./Exclude.demo";
import excludeSource from "./Exclude.demo.tsx?raw";
import { RadioGroupMotionControllerInsideDemo } from "./Inside.demo";
import insideSource from "./Inside.demo.tsx?raw";
import { RadioGroupMotionControllerDemo } from "./PlayRoot.demo";
import playRootSource from "./PlayRoot.demo.tsx?raw";
import { RadioGroupMotionControllerPlayVsSlotDemo } from "./PlayVsSlot.demo";
import playVsSlotSource from "./PlayVsSlot.demo.tsx?raw";
import { RadioGroupMotionControllerStaggerDemo } from "./Stagger.demo";
import staggerSource from "./Stagger.demo.tsx?raw";

export const radioGroupMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-root", title: "play / set", Demo: RadioGroupMotionControllerDemo, source: playRootSource },
  { id: "play-vs-slot", title: "play vs playSlot", Demo: RadioGroupMotionControllerPlayVsSlotDemo, source: playVsSlotSource },
  { id: "stagger", title: "playAll stagger", Demo: RadioGroupMotionControllerStaggerDemo, source: staggerSource },
  { id: "exclude", title: "exclude hint", Demo: RadioGroupMotionControllerExcludeDemo, source: excludeSource },
  { id: "inside", title: "inside tree", Demo: RadioGroupMotionControllerInsideDemo, source: insideSource },
  { id: "cancel", title: "cancel loop", Demo: RadioGroupMotionControllerCancelDemo, source: cancelSource },
  { id: "events-nudge", title: "events yoyo", Demo: RadioGroupMotionEventsNudgeDemo, source: eventsNudgeSource },
  { id: "events-pick", title: "choice:pick targets", Demo: RadioGroupMotionEventsPickDemo, source: eventsPickSource },
  { id: "events-finished", title: "waitForComplete", Demo: RadioGroupMotionEventsFinishedDemo, source: eventsFinishedSource },
  { id: "events-off", title: "events false", Demo: RadioGroupMotionEventsOffDemo, source: eventsOffSource },
];

export function RadioGroupMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="RadioGroup MotionController demos"
      align="stretch"
      items={radioGroupMotionControllerGallery}
    />
  );
}
