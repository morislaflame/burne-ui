import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { TimeFieldMotionControllerCancelDemo } from "./Cancel.demo";
import cancelSource from "./Cancel.demo.tsx?raw";
import { TimeFieldMotionControllerExcludeDemo } from "./Exclude.demo";
import excludeSource from "./Exclude.demo.tsx?raw";
import { TimeFieldMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { TimeFieldMotionEventsKickDemo } from "./EventsKick.demo";
import eventsKickSource from "./EventsKick.demo.tsx?raw";
import { TimeFieldMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";
import { TimeFieldMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { TimeFieldMotionControllerInsideDemo } from "./Inside.demo";
import insideSource from "./Inside.demo.tsx?raw";
import { TimeFieldMotionControllerDemo } from "./PlayShell.demo";
import playShellSource from "./PlayShell.demo.tsx?raw";
import { TimeFieldMotionControllerPlayChromeDemo } from "./PlayChrome.demo";
import playChromeSource from "./PlayChrome.demo.tsx?raw";
import { TimeFieldMotionControllerPlayVsSlotDemo } from "./PlayVsSlot.demo";
import playVsSlotSource from "./PlayVsSlot.demo.tsx?raw";
import { TimeFieldMotionControllerStaggerDemo } from "./Stagger.demo";
import staggerSource from "./Stagger.demo.tsx?raw";

export const timeFieldMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-shell", title: "playSlot / set", Demo: TimeFieldMotionControllerDemo, source: playShellSource },
  { id: "play-vs-slot", title: "playSlot vs playAll", Demo: TimeFieldMotionControllerPlayVsSlotDemo, source: playVsSlotSource },
  { id: "play-chrome", title: "chrome label", Demo: TimeFieldMotionControllerPlayChromeDemo, source: playChromeSource },
  { id: "stagger", title: "playAll stagger", Demo: TimeFieldMotionControllerStaggerDemo, source: staggerSource },
  { id: "exclude", title: "playAll exclude", Demo: TimeFieldMotionControllerExcludeDemo, source: excludeSource },
  { id: "inside", title: "inside tree", Demo: TimeFieldMotionControllerInsideDemo, source: insideSource },
  { id: "cancel", title: "cancel loop", Demo: TimeFieldMotionControllerCancelDemo, source: cancelSource },
  { id: "events-ping", title: "events yoyo", Demo: TimeFieldMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-kick", title: "time:kick targets", Demo: TimeFieldMotionEventsKickDemo, source: eventsKickSource },
  { id: "events-finished", title: "waitForComplete", Demo: TimeFieldMotionEventsFinishedDemo, source: eventsFinishedSource },
  { id: "events-off", title: "events false", Demo: TimeFieldMotionEventsOffDemo, source: eventsOffSource },
];

export function TimeFieldMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="TimeField MotionController demos"
      align="stretch"
      items={timeFieldMotionControllerGallery}
    />
  );
}
