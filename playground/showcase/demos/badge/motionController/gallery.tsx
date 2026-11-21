import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { BadgeMotionControllerAnchorDemo } from "./Anchor.demo";
import anchorSource from "./Anchor.demo.tsx?raw";
import { BadgeMotionEventsCountDemo } from "./EventsCount.demo";
import eventsCountSource from "./EventsCount.demo.tsx?raw";
import { BadgeMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { BadgeMotionEventsTimelineDemo } from "./EventsTimeline.demo";
import eventsTimelineSource from "./EventsTimeline.demo.tsx?raw";
import { BadgeMotionControllerDemo } from "./PlayRoot.demo";
import playRootSource from "./PlayRoot.demo.tsx?raw";
import { BadgeMotionStatesLiveDemo } from "./StatesLive.demo";
import statesLiveSource from "./StatesLive.demo.tsx?raw";

export const badgeMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-root", title: "playSlot / set", Demo: BadgeMotionControllerDemo, source: playRootSource },
  { id: "anchor", title: "Anchor slot", Demo: BadgeMotionControllerAnchorDemo, source: anchorSource },
  { id: "events-ping", title: "events yoyo", Demo: BadgeMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-count", title: "count bump", Demo: BadgeMotionEventsCountDemo, source: eventsCountSource },
  { id: "events-timeline", title: "timeline", Demo: BadgeMotionEventsTimelineDemo, source: eventsTimelineSource },
  { id: "states-live", title: "motionState scramble", Demo: BadgeMotionStatesLiveDemo, source: statesLiveSource },
];

export function BadgeMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Badge MotionController demos"
      items={badgeMotionControllerGallery}
    />
  );
}
