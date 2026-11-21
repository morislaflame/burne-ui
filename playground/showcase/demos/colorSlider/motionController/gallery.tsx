import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { ColorSliderMotionControllerDemo } from "./PlayTrack.demo";
import playtrackSource from "./PlayTrack.demo.tsx?raw";
import { ColorSliderMotionControllerPlayRootDemo } from "./PlayRoot.demo";
import playrootSource from "./PlayRoot.demo.tsx?raw";
import { ColorSliderMotionControllerPlayVsSlotDemo } from "./PlayVsSlot.demo";
import playvsslotSource from "./PlayVsSlot.demo.tsx?raw";
import { ColorSliderMotionControllerInsideDemo } from "./Inside.demo";
import insideSource from "./Inside.demo.tsx?raw";
import { ColorSliderMotionControllerCancelDemo } from "./Cancel.demo";
import cancelSource from "./Cancel.demo.tsx?raw";
import { ColorSliderMotionEventsPingDemo } from "./EventsPing.demo";
import eventspingSource from "./EventsPing.demo.tsx?raw";
import { ColorSliderMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsfinishedSource from "./EventsFinished.demo.tsx?raw";
import { ColorSliderMotionEventsOffDemo } from "./EventsOff.demo";
import eventsoffSource from "./EventsOff.demo.tsx?raw";

export const colorSliderMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-track", title: "playSlot track", Demo: ColorSliderMotionControllerDemo, source: playtrackSource },
  { id: "play-root", title: "compound root", Demo: ColorSliderMotionControllerPlayRootDemo, source: playrootSource },
  { id: "play-vs-slot", title: "play vs playSlot", Demo: ColorSliderMotionControllerPlayVsSlotDemo, source: playvsslotSource },
  { id: "inside", title: "inside tree", Demo: ColorSliderMotionControllerInsideDemo, source: insideSource },
  { id: "cancel", title: "cancel loop", Demo: ColorSliderMotionControllerCancelDemo, source: cancelSource },
  { id: "events-ping", title: "events yoyo", Demo: ColorSliderMotionEventsPingDemo, source: eventspingSource },
  { id: "events-finished", title: "waitForComplete", Demo: ColorSliderMotionEventsFinishedDemo, source: eventsfinishedSource },
  { id: "events-off", title: "events false", Demo: ColorSliderMotionEventsOffDemo, source: eventsoffSource },
];

export function ColorSliderMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="ColorSlider MotionController demos"
      align="stretch"
      items={colorSliderMotionControllerGallery}
    />
  );
}
