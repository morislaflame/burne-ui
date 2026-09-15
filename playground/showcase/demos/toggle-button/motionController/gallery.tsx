import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { ToggleButtonMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { ToggleButtonMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";
import { ToggleButtonMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { ToggleButtonMotionEventsPopDemo } from "./EventsPop.demo";
import eventsPopSource from "./EventsPop.demo.tsx?raw";
import { ToggleButtonMotionControllerExcludeDemo } from "./Exclude.demo";
import excludeSource from "./Exclude.demo.tsx?raw";
import { ToggleButtonMotionControllerIconEndsDemo } from "./IconEnds.demo";
import iconEndsSource from "./IconEnds.demo.tsx?raw";
import { ToggleButtonMotionControllerInsideDemo } from "./Inside.demo";
import insideSource from "./Inside.demo.tsx?raw";
import { ToggleButtonMotionControllerDemo } from "./PlayRoot.demo";
import playRootSource from "./PlayRoot.demo.tsx?raw";
import { ToggleButtonMotionControllerPlayVsSlotDemo } from "./PlayVsSlot.demo";
import playVsSlotSource from "./PlayVsSlot.demo.tsx?raw";
import { ToggleButtonMotionControllerStaggerDemo } from "./Stagger.demo";
import staggerSource from "./Stagger.demo.tsx?raw";

export const toggleButtonMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-root", title: "playSlot / set", Demo: ToggleButtonMotionControllerDemo, source: playRootSource },
  { id: "play-vs-slot", title: "play vs playSlot", Demo: ToggleButtonMotionControllerPlayVsSlotDemo, source: playVsSlotSource },
  { id: "icon-ends", title: "iconStart / iconEnd", Demo: ToggleButtonMotionControllerIconEndsDemo, source: iconEndsSource },
  { id: "stagger", title: "playAll stagger", Demo: ToggleButtonMotionControllerStaggerDemo, source: staggerSource },
  { id: "exclude", title: "exclude fill", Demo: ToggleButtonMotionControllerExcludeDemo, source: excludeSource },
  { id: "inside", title: "inside tree", Demo: ToggleButtonMotionControllerInsideDemo, source: insideSource },
  { id: "events-ping", title: "events yoyo", Demo: ToggleButtonMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-pop", title: "like:pop timeline", Demo: ToggleButtonMotionEventsPopDemo, source: eventsPopSource },
  { id: "events-finished", title: "waitForComplete", Demo: ToggleButtonMotionEventsFinishedDemo, source: eventsFinishedSource },
  { id: "events-off", title: "events false", Demo: ToggleButtonMotionEventsOffDemo, source: eventsOffSource },
];

export function ToggleButtonMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="ToggleButton MotionController demos"
      items={toggleButtonMotionControllerGallery}
    />
  );
}
