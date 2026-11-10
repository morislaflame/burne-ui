import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { RadioMotionControllerDemo } from "./PlayRoot.demo";
import playrootSource from "./PlayRoot.demo.tsx?raw";
import { RadioMotionControllerPlayVsSlotDemo } from "./PlayVsSlot.demo";
import playvsslotSource from "./PlayVsSlot.demo.tsx?raw";
import { RadioMotionControllerPlayLabelDemo } from "./PlayLabel.demo";
import playlabelSource from "./PlayLabel.demo.tsx?raw";
import { RadioMotionControllerStaggerDemo } from "./Stagger.demo";
import staggerSource from "./Stagger.demo.tsx?raw";
import { RadioMotionControllerExcludeDemo } from "./Exclude.demo";
import excludeSource from "./Exclude.demo.tsx?raw";
import { RadioMotionControllerInsideDemo } from "./Inside.demo";
import insideSource from "./Inside.demo.tsx?raw";
import { RadioMotionControllerCancelDemo } from "./Cancel.demo";
import cancelSource from "./Cancel.demo.tsx?raw";
import { RadioMotionEventsPingDemo } from "./EventsPing.demo";
import eventspingSource from "./EventsPing.demo.tsx?raw";
import { RadioMotionEventsKickDemo } from "./EventsKick.demo";
import eventskickSource from "./EventsKick.demo.tsx?raw";
import { RadioMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsfinishedSource from "./EventsFinished.demo.tsx?raw";
import { RadioMotionEventsOffDemo } from "./EventsOff.demo";
import eventsoffSource from "./EventsOff.demo.tsx?raw";

export const radioMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-root", title: "playSlot / set", Demo: RadioMotionControllerDemo, source: playrootSource },
  { id: "play-vs-slot", title: "play vs playSlot", Demo: RadioMotionControllerPlayVsSlotDemo, source: playvsslotSource },
  { id: "play-label", title: "chrome label", Demo: RadioMotionControllerPlayLabelDemo, source: playlabelSource },
  { id: "stagger", title: "playAll stagger", Demo: RadioMotionControllerStaggerDemo, source: staggerSource },
  { id: "exclude", title: "exclude fill", Demo: RadioMotionControllerExcludeDemo, source: excludeSource },
  { id: "inside", title: "inside tree", Demo: RadioMotionControllerInsideDemo, source: insideSource },
  { id: "cancel", title: "cancel loop", Demo: RadioMotionControllerCancelDemo, source: cancelSource },
  { id: "events-ping", title: "events yoyo", Demo: RadioMotionEventsPingDemo, source: eventspingSource },
  { id: "events-kick", title: "radio:scan targets", Demo: RadioMotionEventsKickDemo, source: eventskickSource },
  { id: "events-finished", title: "waitForComplete", Demo: RadioMotionEventsFinishedDemo, source: eventsfinishedSource },
  { id: "events-off", title: "events false", Demo: RadioMotionEventsOffDemo, source: eventsoffSource },
];

export function RadioMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Radio MotionController demos"
      align="stretch"
      items={radioMotionControllerGallery}
    />
  );
}
