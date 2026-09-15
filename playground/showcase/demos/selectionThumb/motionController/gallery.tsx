import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { SelectionThumbMotionControllerDemo } from "./PlayRoot.demo";
import playrootSource from "./PlayRoot.demo.tsx?raw";
import { SelectionThumbMotionControllerPlayVsSlotDemo } from "./PlayVsSlot.demo";
import playvsslotSource from "./PlayVsSlot.demo.tsx?raw";
import { SelectionThumbMotionControllerStaggerDemo } from "./Stagger.demo";
import staggerSource from "./Stagger.demo.tsx?raw";
import { SelectionThumbMotionControllerInsideDemo } from "./Inside.demo";
import insideSource from "./Inside.demo.tsx?raw";
import { SelectionThumbMotionControllerCancelDemo } from "./Cancel.demo";
import cancelSource from "./Cancel.demo.tsx?raw";
import { SelectionThumbMotionEventsPingDemo } from "./EventsPing.demo";
import eventspingSource from "./EventsPing.demo.tsx?raw";
import { SelectionThumbMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsfinishedSource from "./EventsFinished.demo.tsx?raw";
import { SelectionThumbMotionEventsOffDemo } from "./EventsOff.demo";
import eventsoffSource from "./EventsOff.demo.tsx?raw";

export const selectionThumbMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-root", title: "playSlot / set", Demo: SelectionThumbMotionControllerDemo, source: playrootSource },
  { id: "play-vs-slot", title: "play vs playSlot", Demo: SelectionThumbMotionControllerPlayVsSlotDemo, source: playvsslotSource },
  { id: "stagger", title: "playAll stagger", Demo: SelectionThumbMotionControllerStaggerDemo, source: staggerSource },
  { id: "inside", title: "inside tree", Demo: SelectionThumbMotionControllerInsideDemo, source: insideSource },
  { id: "cancel", title: "cancel loop", Demo: SelectionThumbMotionControllerCancelDemo, source: cancelSource },
  { id: "events-ping", title: "events yoyo", Demo: SelectionThumbMotionEventsPingDemo, source: eventspingSource },
  { id: "events-finished", title: "waitForComplete", Demo: SelectionThumbMotionEventsFinishedDemo, source: eventsfinishedSource },
  { id: "events-off", title: "events false", Demo: SelectionThumbMotionEventsOffDemo, source: eventsoffSource },
];

export function SelectionThumbMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="SelectionThumb MotionController demos"
      align="stretch"
      items={selectionThumbMotionControllerGallery}
    />
  );
}
