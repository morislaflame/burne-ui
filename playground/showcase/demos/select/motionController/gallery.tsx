import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { SelectMotionControllerCancelDemo } from "./Cancel.demo";
import cancelSource from "./Cancel.demo.tsx?raw";
import { SelectMotionControllerExcludeDemo } from "./Exclude.demo";
import excludeSource from "./Exclude.demo.tsx?raw";
import { SelectMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { SelectMotionEventsKickDemo } from "./EventsKick.demo";
import eventsKickSource from "./EventsKick.demo.tsx?raw";
import { SelectMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";
import { SelectMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { SelectMotionControllerInsideDemo } from "./Inside.demo";
import insideSource from "./Inside.demo.tsx?raw";
import { SelectMotionControllerDemo } from "./PlayHost.demo";
import playHostSource from "./PlayHost.demo.tsx?raw";
import { SelectMotionControllerPlayChromeDemo } from "./PlayChrome.demo";
import playChromeSource from "./PlayChrome.demo.tsx?raw";
import { SelectMotionControllerPlayVsSlotDemo } from "./PlayVsSlot.demo";
import playVsSlotSource from "./PlayVsSlot.demo.tsx?raw";
import { SelectMotionControllerStaggerDemo } from "./Stagger.demo";
import staggerSource from "./Stagger.demo.tsx?raw";

export const selectMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-host", title: "playSlot / set", Demo: SelectMotionControllerDemo, source: playHostSource },
  { id: "play-vs-slot", title: "playSlot vs playAll", Demo: SelectMotionControllerPlayVsSlotDemo, source: playVsSlotSource },
  { id: "play-chrome", title: "chrome label", Demo: SelectMotionControllerPlayChromeDemo, source: playChromeSource },
  { id: "stagger", title: "playAll stagger", Demo: SelectMotionControllerStaggerDemo, source: staggerSource },
  { id: "exclude", title: "playAll exclude", Demo: SelectMotionControllerExcludeDemo, source: excludeSource },
  { id: "inside", title: "inside tree", Demo: SelectMotionControllerInsideDemo, source: insideSource },
  { id: "cancel", title: "cancel loop", Demo: SelectMotionControllerCancelDemo, source: cancelSource },
  { id: "events-ping", title: "events yoyo", Demo: SelectMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-kick", title: "select:kick targets", Demo: SelectMotionEventsKickDemo, source: eventsKickSource },
  { id: "events-finished", title: "waitForComplete", Demo: SelectMotionEventsFinishedDemo, source: eventsFinishedSource },
  { id: "events-off", title: "events false", Demo: SelectMotionEventsOffDemo, source: eventsOffSource },
];

export function SelectMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Select MotionController demos"
      align="stretch"
      items={selectMotionControllerGallery}
    />
  );
}
