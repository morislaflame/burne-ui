import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { SelectionIndicatorMotionControllerDemo } from "./PlayRoot.demo";
import playrootSource from "./PlayRoot.demo.tsx?raw";
import { SelectionIndicatorMotionControllerPlayVsSlotDemo } from "./PlayVsSlot.demo";
import playvsslotSource from "./PlayVsSlot.demo.tsx?raw";
import { SelectionIndicatorMotionControllerStaggerDemo } from "./Stagger.demo";
import staggerSource from "./Stagger.demo.tsx?raw";
import { SelectionIndicatorMotionControllerExcludeDemo } from "./Exclude.demo";
import excludeSource from "./Exclude.demo.tsx?raw";
import { SelectionIndicatorMotionControllerInsideDemo } from "./Inside.demo";
import insideSource from "./Inside.demo.tsx?raw";
import { SelectionIndicatorMotionControllerCancelDemo } from "./Cancel.demo";
import cancelSource from "./Cancel.demo.tsx?raw";
import { SelectionIndicatorMotionEventsPingDemo } from "./EventsPing.demo";
import eventspingSource from "./EventsPing.demo.tsx?raw";
import { SelectionIndicatorMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsfinishedSource from "./EventsFinished.demo.tsx?raw";
import { SelectionIndicatorMotionEventsOffDemo } from "./EventsOff.demo";
import eventsoffSource from "./EventsOff.demo.tsx?raw";

export const selectionIndicatorMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-root", title: "playSlot / set", Demo: SelectionIndicatorMotionControllerDemo, source: playrootSource },
  { id: "play-vs-slot", title: "play vs playSlot", Demo: SelectionIndicatorMotionControllerPlayVsSlotDemo, source: playvsslotSource },
  { id: "stagger", title: "playAll stagger", Demo: SelectionIndicatorMotionControllerStaggerDemo, source: staggerSource },
  { id: "exclude", title: "exclude fill", Demo: SelectionIndicatorMotionControllerExcludeDemo, source: excludeSource },
  { id: "inside", title: "inside tree", Demo: SelectionIndicatorMotionControllerInsideDemo, source: insideSource },
  { id: "cancel", title: "cancel loop", Demo: SelectionIndicatorMotionControllerCancelDemo, source: cancelSource },
  { id: "events-ping", title: "events yoyo", Demo: SelectionIndicatorMotionEventsPingDemo, source: eventspingSource },
  { id: "events-finished", title: "waitForComplete", Demo: SelectionIndicatorMotionEventsFinishedDemo, source: eventsfinishedSource },
  { id: "events-off", title: "events false", Demo: SelectionIndicatorMotionEventsOffDemo, source: eventsoffSource },
];

export function SelectionIndicatorMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="SelectionIndicator MotionController demos"
      align="stretch"
      items={selectionIndicatorMotionControllerGallery}
    />
  );
}
