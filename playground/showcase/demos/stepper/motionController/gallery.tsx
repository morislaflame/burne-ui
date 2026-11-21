import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { StepperMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { StepperMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";
import { StepperMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { StepperMotionPlayIndicatorDemo } from "./PlayIndicator.demo";
import playIndicatorSource from "./PlayIndicator.demo.tsx?raw";
import { StepperMotionPlayPartsDemo } from "./PlayParts.demo";
import playPartsSource from "./PlayParts.demo.tsx?raw";

export const stepperMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-slot-set", title: "playSlot / set", Demo: StepperMotionPlayIndicatorDemo, source: playIndicatorSource },
  { id: "play-parts", title: "Every slot", Demo: StepperMotionPlayPartsDemo, source: playPartsSource },
  { id: "events-yoyo", title: "events yoyo", Demo: StepperMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-false", title: "events off", Demo: StepperMotionEventsOffDemo, source: eventsOffSource },
  { id: "wait", title: "run.finished", Demo: StepperMotionEventsFinishedDemo, source: eventsFinishedSource },
];

export function StepperMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Stepper MotionController demos"
      align="stretch"
      items={stepperMotionControllerGallery}
    />
  );
}
