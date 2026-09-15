import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { KbdMotionControllerCancelDemo } from "./Cancel.demo";
import cancelSource from "./Cancel.demo.tsx?raw";
import { KbdMotionControllerExcludeDemo } from "./Exclude.demo";
import excludeSource from "./Exclude.demo.tsx?raw";
import { KbdMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { KbdMotionEventsKickDemo } from "./EventsKick.demo";
import eventsKickSource from "./EventsKick.demo.tsx?raw";
import { KbdMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";
import { KbdMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { KbdMotionControllerInsideDemo } from "./Inside.demo";
import insideSource from "./Inside.demo.tsx?raw";
import { KbdMotionControllerPlayGroupDemo } from "./PlayGroup.demo";
import playGroupSource from "./PlayGroup.demo.tsx?raw";
import { KbdMotionControllerDemo } from "./PlayRoot.demo";
import playRootSource from "./PlayRoot.demo.tsx?raw";
import { KbdMotionControllerPlayVsSlotDemo } from "./PlayVsSlot.demo";
import playVsSlotSource from "./PlayVsSlot.demo.tsx?raw";
import { KbdMotionControllerStaggerDemo } from "./Stagger.demo";
import staggerSource from "./Stagger.demo.tsx?raw";

export const kbdMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-root", title: "play / set", Demo: KbdMotionControllerDemo, source: playRootSource },
  { id: "play-vs-slot", title: "play vs playSlot", Demo: KbdMotionControllerPlayVsSlotDemo, source: playVsSlotSource },
  { id: "play-group", title: "standalone Group", Demo: KbdMotionControllerPlayGroupDemo, source: playGroupSource },
  { id: "stagger", title: "playAll stagger", Demo: KbdMotionControllerStaggerDemo, source: staggerSource },
  { id: "exclude", title: "exclude text", Demo: KbdMotionControllerExcludeDemo, source: excludeSource },
  { id: "inside", title: "inside tree", Demo: KbdMotionControllerInsideDemo, source: insideSource },
  { id: "cancel", title: "cancel loop", Demo: KbdMotionControllerCancelDemo, source: cancelSource },
  { id: "events-ping", title: "events yoyo", Demo: KbdMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-kick", title: "kbd:kick targets", Demo: KbdMotionEventsKickDemo, source: eventsKickSource },
  { id: "events-finished", title: "waitForComplete", Demo: KbdMotionEventsFinishedDemo, source: eventsFinishedSource },
  { id: "events-off", title: "events false", Demo: KbdMotionEventsOffDemo, source: eventsOffSource },
];

export function KbdMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Kbd MotionController demos"
      items={kbdMotionControllerGallery}
    />
  );
}
