import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { SwitchMotionControllerDemo } from "./PlayTrack.demo";
import playtrackSource from "./PlayTrack.demo.tsx?raw";
import { SwitchMotionControllerPlayVsSlotDemo } from "./PlayVsSlot.demo";
import playvsslotSource from "./PlayVsSlot.demo.tsx?raw";
import { SwitchMotionControllerPlayLabelDemo } from "./PlayLabel.demo";
import playlabelSource from "./PlayLabel.demo.tsx?raw";
import { SwitchMotionControllerStaggerDemo } from "./Stagger.demo";
import staggerSource from "./Stagger.demo.tsx?raw";
import { SwitchMotionControllerExcludeDemo } from "./Exclude.demo";
import excludeSource from "./Exclude.demo.tsx?raw";
import { SwitchMotionControllerInsideDemo } from "./Inside.demo";
import insideSource from "./Inside.demo.tsx?raw";
import { SwitchMotionControllerCancelDemo } from "./Cancel.demo";
import cancelSource from "./Cancel.demo.tsx?raw";
import { SwitchMotionEventsPingDemo } from "./EventsPing.demo";
import eventspingSource from "./EventsPing.demo.tsx?raw";
import { SwitchMotionEventsKickDemo } from "./EventsKick.demo";
import eventskickSource from "./EventsKick.demo.tsx?raw";
import { SwitchMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsfinishedSource from "./EventsFinished.demo.tsx?raw";
import { SwitchMotionEventsOffDemo } from "./EventsOff.demo";
import eventsoffSource from "./EventsOff.demo.tsx?raw";

export const switchMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-track", title: "playSlot / set", Demo: SwitchMotionControllerDemo, source: playtrackSource },
  { id: "play-vs-slot", title: "play vs playSlot", Demo: SwitchMotionControllerPlayVsSlotDemo, source: playvsslotSource },
  { id: "play-label", title: "chrome label", Demo: SwitchMotionControllerPlayLabelDemo, source: playlabelSource },
  { id: "stagger", title: "playAll stagger", Demo: SwitchMotionControllerStaggerDemo, source: staggerSource },
  { id: "exclude", title: "exclude fill", Demo: SwitchMotionControllerExcludeDemo, source: excludeSource },
  { id: "inside", title: "inside tree", Demo: SwitchMotionControllerInsideDemo, source: insideSource },
  { id: "cancel", title: "cancel loop", Demo: SwitchMotionControllerCancelDemo, source: cancelSource },
  { id: "events-ping", title: "events yoyo", Demo: SwitchMotionEventsPingDemo, source: eventspingSource },
  { id: "events-kick", title: "switch:scan targets", Demo: SwitchMotionEventsKickDemo, source: eventskickSource },
  { id: "events-finished", title: "waitForComplete", Demo: SwitchMotionEventsFinishedDemo, source: eventsfinishedSource },
  { id: "events-off", title: "events false", Demo: SwitchMotionEventsOffDemo, source: eventsoffSource },
];

export function SwitchMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Switch MotionController demos"
      align="stretch"
      items={switchMotionControllerGallery}
    />
  );
}
