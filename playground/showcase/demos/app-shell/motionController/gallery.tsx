import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { AppShellMotionControllerDemo } from "./PlayRoot.demo";
import playRootSource from "./PlayRoot.demo.tsx?raw";
import { AppShellMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { AppShellMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";
import { AppShellMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";

export const appshellMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-root", title: "play / set", Demo: AppShellMotionControllerDemo, source: playRootSource },
  { id: "events-ping", title: "events yoyo", Demo: AppShellMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-off", title: "events false", Demo: AppShellMotionEventsOffDemo, source: eventsOffSource },
  { id: "events-finished", title: "waitForComplete", Demo: AppShellMotionEventsFinishedDemo, source: eventsFinishedSource },
];

export function AppShellMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="AppShell MotionController demos"
      align="stretch"
      items={appshellMotionControllerGallery}
    />
  );
}
