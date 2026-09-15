import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { CheckboxMotionControllerDemo } from "./PlayRoot.demo";
import playrootSource from "./PlayRoot.demo.tsx?raw";
import { CheckboxMotionControllerPlayVsSlotDemo } from "./PlayVsSlot.demo";
import playvsslotSource from "./PlayVsSlot.demo.tsx?raw";
import { CheckboxMotionControllerPlayLabelDemo } from "./PlayLabel.demo";
import playlabelSource from "./PlayLabel.demo.tsx?raw";
import { CheckboxMotionControllerStaggerDemo } from "./Stagger.demo";
import staggerSource from "./Stagger.demo.tsx?raw";
import { CheckboxMotionControllerExcludeDemo } from "./Exclude.demo";
import excludeSource from "./Exclude.demo.tsx?raw";
import { CheckboxMotionControllerInsideDemo } from "./Inside.demo";
import insideSource from "./Inside.demo.tsx?raw";
import { CheckboxMotionControllerCancelDemo } from "./Cancel.demo";
import cancelSource from "./Cancel.demo.tsx?raw";
import { CheckboxMotionEventsPingDemo } from "./EventsPing.demo";
import eventspingSource from "./EventsPing.demo.tsx?raw";
import { CheckboxMotionEventsKickDemo } from "./EventsKick.demo";
import eventskickSource from "./EventsKick.demo.tsx?raw";
import { CheckboxMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsfinishedSource from "./EventsFinished.demo.tsx?raw";
import { CheckboxMotionEventsOffDemo } from "./EventsOff.demo";
import eventsoffSource from "./EventsOff.demo.tsx?raw";

export const checkboxMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-root", title: "playSlot / set", Demo: CheckboxMotionControllerDemo, source: playrootSource },
  { id: "play-vs-slot", title: "play vs playSlot", Demo: CheckboxMotionControllerPlayVsSlotDemo, source: playvsslotSource },
  { id: "play-label", title: "chrome label", Demo: CheckboxMotionControllerPlayLabelDemo, source: playlabelSource },
  { id: "stagger", title: "playAll stagger", Demo: CheckboxMotionControllerStaggerDemo, source: staggerSource },
  { id: "exclude", title: "exclude fill", Demo: CheckboxMotionControllerExcludeDemo, source: excludeSource },
  { id: "inside", title: "inside tree", Demo: CheckboxMotionControllerInsideDemo, source: insideSource },
  { id: "cancel", title: "cancel loop", Demo: CheckboxMotionControllerCancelDemo, source: cancelSource },
  { id: "events-ping", title: "events yoyo", Demo: CheckboxMotionEventsPingDemo, source: eventspingSource },
  { id: "events-kick", title: "check:scan targets", Demo: CheckboxMotionEventsKickDemo, source: eventskickSource },
  { id: "events-finished", title: "waitForComplete", Demo: CheckboxMotionEventsFinishedDemo, source: eventsfinishedSource },
  { id: "events-off", title: "events false", Demo: CheckboxMotionEventsOffDemo, source: eventsoffSource },
];

export function CheckboxMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Checkbox MotionController demos"
      align="stretch"
      items={checkboxMotionControllerGallery}
    />
  );
}
