import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { ButtonMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { ButtonMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { ButtonMotionEventsSaveDemo } from "./EventsSave.demo";
import eventsSaveSource from "./EventsSave.demo.tsx?raw";
import { ButtonMotionControllerDemo } from "./PlayRoot.demo";
import playRootSource from "./PlayRoot.demo.tsx?raw";
import { ButtonMotionControllerStaggerDemo } from "./Stagger.demo";
import staggerSource from "./Stagger.demo.tsx?raw";
import { ButtonMotionStatesBusyDemo } from "./StatesBusy.demo";
import statesBusySource from "./StatesBusy.demo.tsx?raw";

export const buttonMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-root", title: "playSlot / set", Demo: ButtonMotionControllerDemo, source: playRootSource },
  { id: "stagger", title: "playAll stagger", Demo: ButtonMotionControllerStaggerDemo, source: staggerSource },
  { id: "events-ping", title: "events yoyo", Demo: ButtonMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-save", title: "events save", Demo: ButtonMotionEventsSaveDemo, source: eventsSaveSource },
  { id: "events-finished", title: "waitForComplete", Demo: ButtonMotionEventsFinishedDemo, source: eventsFinishedSource },
  { id: "states-busy", title: "motionState", Demo: ButtonMotionStatesBusyDemo, source: statesBusySource },
];

export function ButtonMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Button MotionController demos"
      items={buttonMotionControllerGallery}
    />
  );
}
