import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { DropdownMotionControllerDemo } from "./PlayPanel.demo";
import playPanelSource from "./PlayPanel.demo.tsx?raw";
import { DropdownMotionControllerPlayVsSlotDemo } from "./PlayVsSlot.demo";
import playVsSlotSource from "./PlayVsSlot.demo.tsx?raw";
import { DropdownMotionControllerStaggerDemo } from "./Stagger.demo";
import staggerSource from "./Stagger.demo.tsx?raw";
import { DropdownMotionControllerExcludeDemo } from "./Exclude.demo";
import excludeSource from "./Exclude.demo.tsx?raw";
import { DropdownMotionControllerInsideDemo } from "./Inside.demo";
import insideSource from "./Inside.demo.tsx?raw";
import { DropdownMotionControllerCancelDemo } from "./Cancel.demo";
import cancelSource from "./Cancel.demo.tsx?raw";
import { DropdownMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { DropdownMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { DropdownMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";
import { DropdownMotionControllerPlayTriggerDemo } from "./PlayTrigger.demo";
import playTriggerSource from "./PlayTrigger.demo.tsx?raw";

export const dropdownMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-panel", title: "playSlot / set", Demo: DropdownMotionControllerDemo, source: playPanelSource },
  { id: "play-vs-slot", title: "play vs playSlot", Demo: DropdownMotionControllerPlayVsSlotDemo, source: playVsSlotSource },
  { id: "stagger", title: "playAll items", Demo: DropdownMotionControllerStaggerDemo, source: staggerSource },
  { id: "exclude", title: "exclude content", Demo: DropdownMotionControllerExcludeDemo, source: excludeSource },
  { id: "inside", title: "inside tree", Demo: DropdownMotionControllerInsideDemo, source: insideSource },
  { id: "cancel", title: "cancel loop", Demo: DropdownMotionControllerCancelDemo, source: cancelSource },
  { id: "events-ping", title: "events yoyo", Demo: DropdownMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-finished", title: "waitForComplete", Demo: DropdownMotionEventsFinishedDemo, source: eventsFinishedSource },
  { id: "events-off", title: "events false", Demo: DropdownMotionEventsOffDemo, source: eventsOffSource },
  { id: "play-trigger", title: "Root trigger", Demo: DropdownMotionControllerPlayTriggerDemo, source: playTriggerSource },
];

export function DropdownMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Dropdown MotionController demos"
      align="stretch"
      items={dropdownMotionControllerGallery}
    />
  );
}
