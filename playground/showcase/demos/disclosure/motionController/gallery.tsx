import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { DisclosureMotionControllerDemo } from "./PlayTitle.demo";
import playtitleSource from "./PlayTitle.demo.tsx?raw";
import { DisclosureMotionControllerPlayBodyDemo } from "./PlayBody.demo";
import playbodySource from "./PlayBody.demo.tsx?raw";
import { DisclosureMotionControllerPlayVsSlotDemo } from "./PlayVsSlot.demo";
import playvsslotSource from "./PlayVsSlot.demo.tsx?raw";
import { DisclosureMotionControllerStaggerDemo } from "./Stagger.demo";
import staggerSource from "./Stagger.demo.tsx?raw";
import { DisclosureMotionControllerExcludeDemo } from "./Exclude.demo";
import excludeSource from "./Exclude.demo.tsx?raw";
import { DisclosureMotionControllerInsideDemo } from "./Inside.demo";
import insideSource from "./Inside.demo.tsx?raw";
import { DisclosureMotionControllerCancelDemo } from "./Cancel.demo";
import cancelSource from "./Cancel.demo.tsx?raw";
import { DisclosureMotionEventsPingDemo } from "./EventsPing.demo";
import eventspingSource from "./EventsPing.demo.tsx?raw";
import { DisclosureMotionEventsKickDemo } from "./EventsKick.demo";
import eventskickSource from "./EventsKick.demo.tsx?raw";
import { DisclosureMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsfinishedSource from "./EventsFinished.demo.tsx?raw";
import { DisclosureMotionEventsOffDemo } from "./EventsOff.demo";
import eventsoffSource from "./EventsOff.demo.tsx?raw";

export const disclosureMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-title", title: "playSlot titleLift", Demo: DisclosureMotionControllerDemo, source: playtitleSource },
  { id: "play-body", title: "playSlot body", Demo: DisclosureMotionControllerPlayBodyDemo, source: playbodySource },
  { id: "play-vs-slot", title: "play vs playSlot", Demo: DisclosureMotionControllerPlayVsSlotDemo, source: playvsslotSource },
  { id: "stagger", title: "playAll stagger", Demo: DisclosureMotionControllerStaggerDemo, source: staggerSource },
  { id: "exclude", title: "exclude titleLift", Demo: DisclosureMotionControllerExcludeDemo, source: excludeSource },
  { id: "inside", title: "inside tree", Demo: DisclosureMotionControllerInsideDemo, source: insideSource },
  { id: "cancel", title: "cancel loop", Demo: DisclosureMotionControllerCancelDemo, source: cancelSource },
  { id: "events-ping", title: "events yoyo", Demo: DisclosureMotionEventsPingDemo, source: eventspingSource },
  { id: "events-kick", title: "disclosure:scan targets", Demo: DisclosureMotionEventsKickDemo, source: eventskickSource },
  { id: "events-finished", title: "waitForComplete", Demo: DisclosureMotionEventsFinishedDemo, source: eventsfinishedSource },
  { id: "events-off", title: "events false", Demo: DisclosureMotionEventsOffDemo, source: eventsoffSource },
];

export function DisclosureMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Disclosure MotionController demos"
      align="stretch"
      items={disclosureMotionControllerGallery}
    />
  );
}
