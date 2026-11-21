import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { PinInputMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { PinInputMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";
import { PinInputMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { PinInputMotionPlayFieldDemo } from "./PlayField.demo";
import playFieldSource from "./PlayField.demo.tsx?raw";
import { PinInputMotionPlayPartsDemo } from "./PlayParts.demo";
import playPartsSource from "./PlayParts.demo.tsx?raw";

export const pinInputMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-slot-set", title: "playSlot / set", Demo: PinInputMotionPlayFieldDemo, source: playFieldSource },
  { id: "play-parts", title: "Every slot", Demo: PinInputMotionPlayPartsDemo, source: playPartsSource },
  { id: "events-yoyo", title: "events yoyo", Demo: PinInputMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-false", title: "events off", Demo: PinInputMotionEventsOffDemo, source: eventsOffSource },
  { id: "wait", title: "run.finished", Demo: PinInputMotionEventsFinishedDemo, source: eventsFinishedSource },
];

export function PinInputMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="PinInput MotionController demos"
      align="start"
      items={pinInputMotionControllerGallery}
    />
  );
}
