import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { DatePickerMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { DatePickerMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";
import { DatePickerMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { DatePickerMotionPlayPartsDemo } from "./PlayParts.demo";
import playPartsSource from "./PlayParts.demo.tsx?raw";
import { DatePickerMotionPlayTriggerDemo } from "./PlayTrigger.demo";
import playTriggerSource from "./PlayTrigger.demo.tsx?raw";

export const datePickerMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-slot-set", title: "playSlot / set", Demo: DatePickerMotionPlayTriggerDemo, source: playTriggerSource },
  { id: "play-parts", title: "Every slot", Demo: DatePickerMotionPlayPartsDemo, source: playPartsSource },
  { id: "events-yoyo", title: "events yoyo", Demo: DatePickerMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-false", title: "events off", Demo: DatePickerMotionEventsOffDemo, source: eventsOffSource },
  { id: "wait", title: "run.finished", Demo: DatePickerMotionEventsFinishedDemo, source: eventsFinishedSource },
];

export function DatePickerMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="DatePicker MotionController demos"
      align="stretch"
      items={datePickerMotionControllerGallery}
    />
  );
}
