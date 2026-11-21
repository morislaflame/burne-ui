import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { CardMotionEventsCancelDemo } from "./EventsCancel.demo";
import eventsCancelSource from "./EventsCancel.demo.tsx?raw";
import { CardMotionEventsCheckoutDemo } from "./EventsCheckout.demo";
import eventsCheckoutSource from "./EventsCheckout.demo.tsx?raw";
import { CardMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { CardMotionEventsPressableDemo } from "./EventsPressable.demo";
import eventsPressableSource from "./EventsPressable.demo.tsx?raw";
import { CardMotionControllerExcludeDemo } from "./Exclude.demo";
import excludeSource from "./Exclude.demo.tsx?raw";
import { CardMotionControllerHighlightDemo } from "./Highlight.demo";
import highlightSource from "./Highlight.demo.tsx?raw";
import { CardMotionControllerInsideDemo } from "./Inside.demo";
import insideSource from "./Inside.demo.tsx?raw";
import { CardMotionControllerSetDemo } from "./Set.demo";
import setSource from "./Set.demo.tsx?raw";
import { CardMotionControllerStaggerDemo } from "./Stagger.demo";
import staggerSource from "./Stagger.demo.tsx?raw";
import { CardMotionStatesCheckoutDemo } from "./StatesCheckout.demo";
import statesCheckoutSource from "./StatesCheckout.demo.tsx?raw";

export const cardMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "events-checkout", title: "events factory", Demo: CardMotionEventsCheckoutDemo, source: eventsCheckoutSource },
  { id: "events-finished", title: "waitForComplete", Demo: CardMotionEventsFinishedDemo, source: eventsFinishedSource },
  { id: "events-cancel", title: "cancel", Demo: CardMotionEventsCancelDemo, source: eventsCancelSource },
  { id: "events-pressable", title: "pressable", Demo: CardMotionEventsPressableDemo, source: eventsPressableSource },
  { id: "inside", title: "useMotionController", Demo: CardMotionControllerInsideDemo, source: insideSource },
  { id: "highlight", title: "playSlot part", Demo: CardMotionControllerHighlightDemo, source: highlightSource },
  { id: "stagger", title: "playAll stagger", Demo: CardMotionControllerStaggerDemo, source: staggerSource },
  { id: "exclude", title: "exclude", Demo: CardMotionControllerExcludeDemo, source: excludeSource },
  { id: "set", title: "set", Demo: CardMotionControllerSetDemo, source: setSource },
  { id: "states-checkout", title: "motionState", Demo: CardMotionStatesCheckoutDemo, source: statesCheckoutSource },
];

export function CardMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Card MotionController demos"
      items={cardMotionControllerGallery}
    />
  );
}
