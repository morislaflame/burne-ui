import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { NumberInputMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { NumberInputMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";
import { NumberInputMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { NumberInputMotionPlayPartsDemo } from "./PlayParts.demo";
import playPartsSource from "./PlayParts.demo.tsx?raw";
import { NumberInputMotionPlayShellDemo } from "./PlayShell.demo";
import playShellSource from "./PlayShell.demo.tsx?raw";

export const numberInputMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-slot-set", title: "playSlot / set", Demo: NumberInputMotionPlayShellDemo, source: playShellSource },
  { id: "play-parts", title: "Every slot", Demo: NumberInputMotionPlayPartsDemo, source: playPartsSource },
  { id: "events-yoyo", title: "events yoyo", Demo: NumberInputMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-false", title: "events off", Demo: NumberInputMotionEventsOffDemo, source: eventsOffSource },
  { id: "wait", title: "run.finished", Demo: NumberInputMotionEventsFinishedDemo, source: eventsFinishedSource },
];

export function NumberInputMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="NumberInput MotionController demos"
      align="start"
      items={numberInputMotionControllerGallery}
    />
  );
}
