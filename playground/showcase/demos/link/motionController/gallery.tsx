import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { LinkMotionEventsCopiedDemo } from "./EventsCopied.demo";
import eventsCopiedSource from "./EventsCopied.demo.tsx?raw";
import { LinkMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { LinkMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";
import { LinkMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { LinkMotionControllerExcludeDemo } from "./Exclude.demo";
import excludeSource from "./Exclude.demo.tsx?raw";
import { LinkMotionControllerIconTextDemo } from "./IconText.demo";
import iconTextSource from "./IconText.demo.tsx?raw";
import { LinkMotionControllerDemo } from "./PlayRoot.demo";
import playRootSource from "./PlayRoot.demo.tsx?raw";
import { LinkMotionControllerPlayVsSlotDemo } from "./PlayVsSlot.demo";
import playVsSlotSource from "./PlayVsSlot.demo.tsx?raw";
import { LinkMotionControllerStaggerDemo } from "./Stagger.demo";
import staggerSource from "./Stagger.demo.tsx?raw";
import { LinkMotionStatesShareDemo } from "./StatesShare.demo";
import statesShareSource from "./StatesShare.demo.tsx?raw";

export const linkMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-root", title: "playSlot / set", Demo: LinkMotionControllerDemo, source: playRootSource },
  { id: "play-vs-slot", title: "play vs playSlot", Demo: LinkMotionControllerPlayVsSlotDemo, source: playVsSlotSource },
  { id: "icon-text", title: "icon / text", Demo: LinkMotionControllerIconTextDemo, source: iconTextSource },
  { id: "stagger", title: "playAll stagger", Demo: LinkMotionControllerStaggerDemo, source: staggerSource },
  { id: "exclude", title: "exclude root", Demo: LinkMotionControllerExcludeDemo, source: excludeSource },
  { id: "events-ping", title: "events yoyo", Demo: LinkMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-copied", title: "copied timeline", Demo: LinkMotionEventsCopiedDemo, source: eventsCopiedSource },
  { id: "events-finished", title: "waitForComplete", Demo: LinkMotionEventsFinishedDemo, source: eventsFinishedSource },
  { id: "events-off", title: "events false", Demo: LinkMotionEventsOffDemo, source: eventsOffSource },
  { id: "states-share", title: "motionState SplitText", Demo: LinkMotionStatesShareDemo, source: statesShareSource },
];

export function LinkMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Link MotionController demos"
      items={linkMotionControllerGallery}
    />
  );
}
