import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { ComboBoxMotionControllerCancelDemo } from "./Cancel.demo";
import cancelSource from "./Cancel.demo.tsx?raw";
import { ComboBoxMotionControllerExcludeDemo } from "./Exclude.demo";
import excludeSource from "./Exclude.demo.tsx?raw";
import { ComboBoxMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { ComboBoxMotionEventsKickDemo } from "./EventsKick.demo";
import eventsKickSource from "./EventsKick.demo.tsx?raw";
import { ComboBoxMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";
import { ComboBoxMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { ComboBoxMotionControllerInsideDemo } from "./Inside.demo";
import insideSource from "./Inside.demo.tsx?raw";
import { ComboBoxMotionControllerDemo } from "./PlayHost.demo";
import playHostSource from "./PlayHost.demo.tsx?raw";
import { ComboBoxMotionControllerPlayChromeDemo } from "./PlayChrome.demo";
import playChromeSource from "./PlayChrome.demo.tsx?raw";
import { ComboBoxMotionControllerPlayVsSlotDemo } from "./PlayVsSlot.demo";
import playVsSlotSource from "./PlayVsSlot.demo.tsx?raw";
import { ComboBoxMotionControllerStaggerDemo } from "./Stagger.demo";
import staggerSource from "./Stagger.demo.tsx?raw";

export const comboBoxMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-host", title: "playSlot / set", Demo: ComboBoxMotionControllerDemo, source: playHostSource },
  { id: "play-vs-slot", title: "playSlot vs playAll", Demo: ComboBoxMotionControllerPlayVsSlotDemo, source: playVsSlotSource },
  { id: "play-chrome", title: "chrome label", Demo: ComboBoxMotionControllerPlayChromeDemo, source: playChromeSource },
  { id: "stagger", title: "playAll stagger", Demo: ComboBoxMotionControllerStaggerDemo, source: staggerSource },
  { id: "exclude", title: "playAll exclude", Demo: ComboBoxMotionControllerExcludeDemo, source: excludeSource },
  { id: "inside", title: "inside tree", Demo: ComboBoxMotionControllerInsideDemo, source: insideSource },
  { id: "cancel", title: "cancel loop", Demo: ComboBoxMotionControllerCancelDemo, source: cancelSource },
  { id: "events-ping", title: "events yoyo", Demo: ComboBoxMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-kick", title: "combo:kick targets", Demo: ComboBoxMotionEventsKickDemo, source: eventsKickSource },
  { id: "events-finished", title: "waitForComplete", Demo: ComboBoxMotionEventsFinishedDemo, source: eventsFinishedSource },
  { id: "events-off", title: "events false", Demo: ComboBoxMotionEventsOffDemo, source: eventsOffSource },
];

export function ComboBoxMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="ComboBox MotionController demos"
      align="stretch"
      items={comboBoxMotionControllerGallery}
    />
  );
}
