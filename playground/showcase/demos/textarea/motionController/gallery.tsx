import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { TextAreaMotionControllerCancelDemo } from "./Cancel.demo";
import cancelSource from "./Cancel.demo.tsx?raw";
import { TextAreaMotionControllerExcludeDemo } from "./Exclude.demo";
import excludeSource from "./Exclude.demo.tsx?raw";
import { TextAreaMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { TextAreaMotionEventsKickDemo } from "./EventsKick.demo";
import eventsKickSource from "./EventsKick.demo.tsx?raw";
import { TextAreaMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";
import { TextAreaMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { TextAreaMotionControllerInsideDemo } from "./Inside.demo";
import insideSource from "./Inside.demo.tsx?raw";
import { TextAreaMotionControllerDemo } from "./PlayShell.demo";
import playShellSource from "./PlayShell.demo.tsx?raw";
import { TextAreaMotionControllerPlayChromeDemo } from "./PlayChrome.demo";
import playChromeSource from "./PlayChrome.demo.tsx?raw";
import { TextAreaMotionControllerPlayVsSlotDemo } from "./PlayVsSlot.demo";
import playVsSlotSource from "./PlayVsSlot.demo.tsx?raw";
import { TextAreaMotionControllerStaggerDemo } from "./Stagger.demo";
import staggerSource from "./Stagger.demo.tsx?raw";

export const textAreaMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-shell", title: "playSlot / set", Demo: TextAreaMotionControllerDemo, source: playShellSource },
  { id: "play-vs-slot", title: "playSlot vs playAll", Demo: TextAreaMotionControllerPlayVsSlotDemo, source: playVsSlotSource },
  { id: "play-chrome", title: "chrome label", Demo: TextAreaMotionControllerPlayChromeDemo, source: playChromeSource },
  { id: "stagger", title: "playAll stagger", Demo: TextAreaMotionControllerStaggerDemo, source: staggerSource },
  { id: "exclude", title: "playAll exclude", Demo: TextAreaMotionControllerExcludeDemo, source: excludeSource },
  { id: "inside", title: "inside tree", Demo: TextAreaMotionControllerInsideDemo, source: insideSource },
  { id: "cancel", title: "cancel loop", Demo: TextAreaMotionControllerCancelDemo, source: cancelSource },
  { id: "events-ping", title: "events yoyo", Demo: TextAreaMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-kick", title: "area:kick targets", Demo: TextAreaMotionEventsKickDemo, source: eventsKickSource },
  { id: "events-finished", title: "waitForComplete", Demo: TextAreaMotionEventsFinishedDemo, source: eventsFinishedSource },
  { id: "events-off", title: "events false", Demo: TextAreaMotionEventsOffDemo, source: eventsOffSource },
];

export function TextAreaMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="TextArea MotionController demos"
      align="stretch"
      items={textAreaMotionControllerGallery}
    />
  );
}
