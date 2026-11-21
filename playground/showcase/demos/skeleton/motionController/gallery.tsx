import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { SkeletonMotionControllerCancelDemo } from "./Cancel.demo";
import cancelSource from "./Cancel.demo.tsx?raw";
import { SkeletonMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { SkeletonMotionEventsKickDemo } from "./EventsKick.demo";
import eventsKickSource from "./EventsKick.demo.tsx?raw";
import { SkeletonMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";
import { SkeletonMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { SkeletonMotionControllerInsideDemo } from "./Inside.demo";
import insideSource from "./Inside.demo.tsx?raw";
import { SkeletonMotionControllerPlayRegionDemo } from "./PlayRegion.demo";
import playRegionSource from "./PlayRegion.demo.tsx?raw";
import { SkeletonMotionControllerDemo } from "./PlayRoot.demo";
import playRootSource from "./PlayRoot.demo.tsx?raw";

export const skeletonMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-root", title: "play / set", Demo: SkeletonMotionControllerDemo, source: playRootSource },
  { id: "play-region", title: "Region slot", Demo: SkeletonMotionControllerPlayRegionDemo, source: playRegionSource },
  { id: "inside", title: "inside tree", Demo: SkeletonMotionControllerInsideDemo, source: insideSource },
  { id: "cancel", title: "cancel loop", Demo: SkeletonMotionControllerCancelDemo, source: cancelSource },
  { id: "events-ping", title: "events yoyo", Demo: SkeletonMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-kick", title: "skel:kick timeline", Demo: SkeletonMotionEventsKickDemo, source: eventsKickSource },
  { id: "events-finished", title: "waitForComplete", Demo: SkeletonMotionEventsFinishedDemo, source: eventsFinishedSource },
  { id: "events-off", title: "events false", Demo: SkeletonMotionEventsOffDemo, source: eventsOffSource },
];

export function SkeletonMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Skeleton MotionController demos"
      align="stretch"
      items={skeletonMotionControllerGallery}
    />
  );
}
