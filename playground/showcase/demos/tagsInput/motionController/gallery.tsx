import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { TagsInputMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { TagsInputMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";
import { TagsInputMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { TagsInputMotionPlayPartsDemo } from "./PlayParts.demo";
import playPartsSource from "./PlayParts.demo.tsx?raw";
import { TagsInputMotionPlayTagDemo } from "./PlayTag.demo";
import playTagSource from "./PlayTag.demo.tsx?raw";

export const tagsInputMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-slot-set", title: "playSlot / set", Demo: TagsInputMotionPlayTagDemo, source: playTagSource },
  { id: "play-parts", title: "Every slot", Demo: TagsInputMotionPlayPartsDemo, source: playPartsSource },
  { id: "events-yoyo", title: "events yoyo", Demo: TagsInputMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-false", title: "events off", Demo: TagsInputMotionEventsOffDemo, source: eventsOffSource },
  { id: "wait", title: "run.finished", Demo: TagsInputMotionEventsFinishedDemo, source: eventsFinishedSource },
];

export function TagsInputMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="TagsInput MotionController demos"
      align="start"
      items={tagsInputMotionControllerGallery}
    />
  );
}
