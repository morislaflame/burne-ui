import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { CloseButtonMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { CloseButtonMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";
import { CloseButtonMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { CloseButtonMotionEventsSpinDemo } from "./EventsSpin.demo";
import eventsSpinSource from "./EventsSpin.demo.tsx?raw";
import { CloseButtonMotionControllerDemo } from "./PlayRoot.demo";
import playRootSource from "./PlayRoot.demo.tsx?raw";
import { CloseButtonMotionControllerPlayVsSlotDemo } from "./PlayVsSlot.demo";
import playVsSlotSource from "./PlayVsSlot.demo.tsx?raw";
import { CloseButtonMotionControllerStaggerDemo } from "./Stagger.demo";
import staggerSource from "./Stagger.demo.tsx?raw";

export const closeButtonMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-root", title: "playSlot / set", Demo: CloseButtonMotionControllerDemo, source: playRootSource },
  { id: "play-vs-slot", title: "play vs playSlot", Demo: CloseButtonMotionControllerPlayVsSlotDemo, source: playVsSlotSource },
  { id: "stagger", title: "playAll stagger", Demo: CloseButtonMotionControllerStaggerDemo, source: staggerSource },
  { id: "events-ping", title: "events yoyo", Demo: CloseButtonMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-spin", title: "icon timeline", Demo: CloseButtonMotionEventsSpinDemo, source: eventsSpinSource },
  { id: "events-finished", title: "waitForComplete", Demo: CloseButtonMotionEventsFinishedDemo, source: eventsFinishedSource },
  { id: "events-off", title: "events false", Demo: CloseButtonMotionEventsOffDemo, source: eventsOffSource },
];

export function CloseButtonMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="CloseButton MotionController demos"
      items={closeButtonMotionControllerGallery}
    />
  );
}
