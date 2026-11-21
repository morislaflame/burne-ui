import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { InputMotionControllerCancelDemo } from "./Cancel.demo";
import cancelSource from "./Cancel.demo.tsx?raw";
import { InputMotionControllerExcludeDemo } from "./Exclude.demo";
import excludeSource from "./Exclude.demo.tsx?raw";
import { InputMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { InputMotionEventsKickDemo } from "./EventsKick.demo";
import eventsKickSource from "./EventsKick.demo.tsx?raw";
import { InputMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";
import { InputMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { InputMotionControllerInsideDemo } from "./Inside.demo";
import insideSource from "./Inside.demo.tsx?raw";
import { InputMotionControllerDemo } from "./PlayShell.demo";
import playShellSource from "./PlayShell.demo.tsx?raw";
import { InputMotionControllerPlayChromeDemo } from "./PlayChrome.demo";
import playChromeSource from "./PlayChrome.demo.tsx?raw";
import { InputMotionControllerPlayVsSlotDemo } from "./PlayVsSlot.demo";
import playVsSlotSource from "./PlayVsSlot.demo.tsx?raw";
import { InputMotionControllerStaggerDemo } from "./Stagger.demo";
import staggerSource from "./Stagger.demo.tsx?raw";

export const inputMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-shell", title: "playSlot / set", Demo: InputMotionControllerDemo, source: playShellSource },
  { id: "play-vs-slot", title: "playSlot vs playAll", Demo: InputMotionControllerPlayVsSlotDemo, source: playVsSlotSource },
  { id: "play-chrome", title: "chrome label", Demo: InputMotionControllerPlayChromeDemo, source: playChromeSource },
  { id: "stagger", title: "playAll stagger", Demo: InputMotionControllerStaggerDemo, source: staggerSource },
  { id: "exclude", title: "playAll exclude", Demo: InputMotionControllerExcludeDemo, source: excludeSource },
  { id: "inside", title: "inside tree", Demo: InputMotionControllerInsideDemo, source: insideSource },
  { id: "cancel", title: "cancel loop", Demo: InputMotionControllerCancelDemo, source: cancelSource },
  { id: "events-ping", title: "events yoyo", Demo: InputMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-kick", title: "input:kick targets", Demo: InputMotionEventsKickDemo, source: eventsKickSource },
  { id: "events-finished", title: "waitForComplete", Demo: InputMotionEventsFinishedDemo, source: eventsFinishedSource },
  { id: "events-off", title: "events false", Demo: InputMotionEventsOffDemo, source: eventsOffSource },
];

export function InputMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Input MotionController demos"
      align="stretch"
      items={inputMotionControllerGallery}
    />
  );
}
