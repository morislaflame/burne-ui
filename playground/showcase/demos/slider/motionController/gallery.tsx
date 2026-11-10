import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { SliderMotionControllerCancelDemo } from "./Cancel.demo";
import cancelSource from "./Cancel.demo.tsx?raw";
import { SliderMotionControllerExcludeDemo } from "./Exclude.demo";
import excludeSource from "./Exclude.demo.tsx?raw";
import { SliderMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { SliderMotionEventsKickDemo } from "./EventsKick.demo";
import eventsKickSource from "./EventsKick.demo.tsx?raw";
import { SliderMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";
import { SliderMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { SliderMotionControllerInsideDemo } from "./Inside.demo";
import insideSource from "./Inside.demo.tsx?raw";
import { SliderMotionControllerDemo } from "./PlayTrack.demo";
import playTrackSource from "./PlayTrack.demo.tsx?raw";
import { SliderMotionControllerPlayChromeDemo } from "./PlayChrome.demo";
import playChromeSource from "./PlayChrome.demo.tsx?raw";
import { SliderMotionControllerPlayVsSlotDemo } from "./PlayVsSlot.demo";
import playVsSlotSource from "./PlayVsSlot.demo.tsx?raw";
import { SliderMotionControllerStaggerDemo } from "./Stagger.demo";
import staggerSource from "./Stagger.demo.tsx?raw";

export const sliderMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-track", title: "playSlot / set", Demo: SliderMotionControllerDemo, source: playTrackSource },
  { id: "play-vs-slot", title: "playSlot vs playAll", Demo: SliderMotionControllerPlayVsSlotDemo, source: playVsSlotSource },
  { id: "play-chrome", title: "chrome label", Demo: SliderMotionControllerPlayChromeDemo, source: playChromeSource },
  { id: "stagger", title: "playAll stagger", Demo: SliderMotionControllerStaggerDemo, source: staggerSource },
  { id: "exclude", title: "playAll exclude", Demo: SliderMotionControllerExcludeDemo, source: excludeSource },
  { id: "inside", title: "inside tree", Demo: SliderMotionControllerInsideDemo, source: insideSource },
  { id: "cancel", title: "cancel loop", Demo: SliderMotionControllerCancelDemo, source: cancelSource },
  { id: "events-ping", title: "events yoyo", Demo: SliderMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-kick", title: "slider:kick targets", Demo: SliderMotionEventsKickDemo, source: eventsKickSource },
  { id: "events-finished", title: "waitForComplete", Demo: SliderMotionEventsFinishedDemo, source: eventsFinishedSource },
  { id: "events-off", title: "events false", Demo: SliderMotionEventsOffDemo, source: eventsOffSource },
];

export function SliderMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Slider MotionController demos"
      align="stretch"
      items={sliderMotionControllerGallery}
    />
  );
}
