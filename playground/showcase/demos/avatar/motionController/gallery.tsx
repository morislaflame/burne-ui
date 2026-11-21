import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { AvatarMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { AvatarMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { AvatarMotionEventsPresenceDemo } from "./EventsPresence.demo";
import eventsPresenceSource from "./EventsPresence.demo.tsx?raw";
import { AvatarMotionControllerDemo } from "./PlayRoot.demo";
import playRootSource from "./PlayRoot.demo.tsx?raw";
import { AvatarMotionControllerSlotsDemo } from "./Slots.demo";
import slotsSource from "./Slots.demo.tsx?raw";

export const avatarMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-root", title: "playSlot / set", Demo: AvatarMotionControllerDemo, source: playRootSource },
  { id: "slots", title: "image / fallback", Demo: AvatarMotionControllerSlotsDemo, source: slotsSource },
  { id: "events-ping", title: "events yoyo", Demo: AvatarMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-presence", title: "timeline", Demo: AvatarMotionEventsPresenceDemo, source: eventsPresenceSource },
  { id: "events-finished", title: "waitForComplete", Demo: AvatarMotionEventsFinishedDemo, source: eventsFinishedSource },
];

export function AvatarMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Avatar MotionController demos"
      items={avatarMotionControllerGallery}
    />
  );
}
