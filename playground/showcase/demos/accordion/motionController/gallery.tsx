import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { AccordionMotionControllerDemo } from "./PlayTitle.demo";
import playTitleSource from "./PlayTitle.demo.tsx?raw";
import { AccordionMotionControllerStaggerDemo } from "./Stagger.demo";
import staggerSource from "./Stagger.demo.tsx?raw";
import { AccordionMotionControllerExcludeDemo } from "./Exclude.demo";
import excludeSource from "./Exclude.demo.tsx?raw";
import { AccordionMotionControllerInsideDemo } from "./Inside.demo";
import insideSource from "./Inside.demo.tsx?raw";
import { AccordionMotionControllerCancelDemo } from "./Cancel.demo";
import cancelSource from "./Cancel.demo.tsx?raw";
import { AccordionMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { AccordionMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { AccordionMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";
import { AccordionMotionControllerRepeatedDemo } from "./Repeated.demo";
import repeatedSource from "./Repeated.demo.tsx?raw";

export const accordionMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-title", title: "playSlot / set", Demo: AccordionMotionControllerDemo, source: playTitleSource },
  { id: "stagger", title: "playAll stagger", Demo: AccordionMotionControllerStaggerDemo, source: staggerSource },
  { id: "exclude", title: "exclude chevron", Demo: AccordionMotionControllerExcludeDemo, source: excludeSource },
  { id: "inside", title: "inside tree", Demo: AccordionMotionControllerInsideDemo, source: insideSource },
  { id: "cancel", title: "cancel loop", Demo: AccordionMotionControllerCancelDemo, source: cancelSource },
  { id: "events-ping", title: "events yoyo", Demo: AccordionMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-finished", title: "waitForComplete", Demo: AccordionMotionEventsFinishedDemo, source: eventsFinishedSource },
  { id: "events-off", title: "events false", Demo: AccordionMotionEventsOffDemo, source: eventsOffSource },
  { id: "repeated", title: "one handle / item", Demo: AccordionMotionControllerRepeatedDemo, source: repeatedSource },
];

export function AccordionMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Accordion MotionController demos"
      align="stretch"
      items={accordionMotionControllerGallery}
    />
  );
}
