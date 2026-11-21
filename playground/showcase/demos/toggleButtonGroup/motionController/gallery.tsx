import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { ToggleButtonGroupMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { ToggleButtonGroupMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";
import { ToggleButtonGroupMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { ToggleButtonGroupMotionEventsStackDemo } from "./EventsStack.demo";
import eventsStackSource from "./EventsStack.demo.tsx?raw";
import { ToggleButtonGroupMotionControllerDemo } from "./PlayRoot.demo";
import playRootSource from "./PlayRoot.demo.tsx?raw";

export const toggleButtonGroupMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-root", title: "playSlot / set", Demo: ToggleButtonGroupMotionControllerDemo, source: playRootSource },
  { id: "events-ping", title: "events yoyo", Demo: ToggleButtonGroupMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-stack", title: "timeline", Demo: ToggleButtonGroupMotionEventsStackDemo, source: eventsStackSource },
  { id: "events-finished", title: "waitForComplete", Demo: ToggleButtonGroupMotionEventsFinishedDemo, source: eventsFinishedSource },
  { id: "events-off", title: "events false", Demo: ToggleButtonGroupMotionEventsOffDemo, source: eventsOffSource },
];

export function ToggleButtonGroupMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="ToggleButtonGroup MotionController demos"
      items={toggleButtonGroupMotionControllerGallery}
    />
  );
}
