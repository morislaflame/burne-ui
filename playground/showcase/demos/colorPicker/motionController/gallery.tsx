import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { ColorPickerMotionControllerCancelDemo } from "./Cancel.demo";
import cancelSource from "./Cancel.demo.tsx?raw";
import { ColorPickerMotionControllerExcludeDemo } from "./Exclude.demo";
import excludeSource from "./Exclude.demo.tsx?raw";
import { ColorPickerMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { ColorPickerMotionEventsKickDemo } from "./EventsKick.demo";
import eventsKickSource from "./EventsKick.demo.tsx?raw";
import { ColorPickerMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";
import { ColorPickerMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { ColorPickerMotionControllerInsideDemo } from "./Inside.demo";
import insideSource from "./Inside.demo.tsx?raw";
import { ColorPickerMotionControllerPlayAreaDemo } from "./PlayArea.demo";
import playAreaSource from "./PlayArea.demo.tsx?raw";
import { ColorPickerMotionControllerDemo } from "./PlayPanel.demo";
import playPanelSource from "./PlayPanel.demo.tsx?raw";
import { ColorPickerMotionControllerPlayVsSlotDemo } from "./PlayVsSlot.demo";
import playVsSlotSource from "./PlayVsSlot.demo.tsx?raw";
import { ColorPickerMotionControllerStaggerDemo } from "./Stagger.demo";
import staggerSource from "./Stagger.demo.tsx?raw";

export const colorPickerMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-panel", title: "playSlot / set", Demo: ColorPickerMotionControllerDemo, source: playPanelSource },
  { id: "play-vs-slot", title: "playSlot vs playAll", Demo: ColorPickerMotionControllerPlayVsSlotDemo, source: playVsSlotSource },
  { id: "play-area", title: "area slot", Demo: ColorPickerMotionControllerPlayAreaDemo, source: playAreaSource },
  { id: "stagger", title: "playAll stagger", Demo: ColorPickerMotionControllerStaggerDemo, source: staggerSource },
  { id: "exclude", title: "exclude hexInput", Demo: ColorPickerMotionControllerExcludeDemo, source: excludeSource },
  { id: "inside", title: "inside tree", Demo: ColorPickerMotionControllerInsideDemo, source: insideSource },
  { id: "cancel", title: "cancel loop", Demo: ColorPickerMotionControllerCancelDemo, source: cancelSource },
  { id: "events-ping", title: "events yoyo", Demo: ColorPickerMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-kick", title: "picker:kick targets", Demo: ColorPickerMotionEventsKickDemo, source: eventsKickSource },
  { id: "events-finished", title: "waitForComplete", Demo: ColorPickerMotionEventsFinishedDemo, source: eventsFinishedSource },
  { id: "events-off", title: "events false", Demo: ColorPickerMotionEventsOffDemo, source: eventsOffSource },
];

export function ColorPickerMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="ColorPicker MotionController demos"
      align="stretch"
      items={colorPickerMotionControllerGallery}
    />
  );
}
