import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { ButtonGroupMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { ButtonGroupMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";
import { ButtonGroupMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { ButtonGroupMotionEventsScanDemo } from "./EventsScan.demo";
import eventsScanSource from "./EventsScan.demo.tsx?raw";
import { ButtonGroupMotionControllerInsideDemo } from "./Inside.demo";
import insideSource from "./Inside.demo.tsx?raw";
import { ButtonGroupMotionControllerDemo } from "./PlayRoot.demo";
import playRootSource from "./PlayRoot.demo.tsx?raw";
import { ButtonGroupMotionControllerPlayVsSlotDemo } from "./PlayVsSlot.demo";
import playVsSlotSource from "./PlayVsSlot.demo.tsx?raw";
import { ButtonGroupMotionControllerStaggerDemo } from "./Stagger.demo";
import staggerSource from "./Stagger.demo.tsx?raw";

export const buttonGroupMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-root", title: "playSlot / set", Demo: ButtonGroupMotionControllerDemo, source: playRootSource },
  { id: "play-vs-slot", title: "play vs playSlot", Demo: ButtonGroupMotionControllerPlayVsSlotDemo, source: playVsSlotSource },
  { id: "stagger", title: "playAll stagger", Demo: ButtonGroupMotionControllerStaggerDemo, source: staggerSource },
  { id: "inside", title: "inside tree", Demo: ButtonGroupMotionControllerInsideDemo, source: insideSource },
  { id: "events-ping", title: "events yoyo", Demo: ButtonGroupMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-scan", title: "toolbar:scan targets", Demo: ButtonGroupMotionEventsScanDemo, source: eventsScanSource },
  { id: "events-finished", title: "waitForComplete", Demo: ButtonGroupMotionEventsFinishedDemo, source: eventsFinishedSource },
  { id: "events-off", title: "events false", Demo: ButtonGroupMotionEventsOffDemo, source: eventsOffSource },
];

export function ButtonGroupMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="ButtonGroup MotionController demos"
      items={buttonGroupMotionControllerGallery}
    />
  );
}
