import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { SidebarMotionControllerDemo } from "./PlayRoot.demo";
import playRootSource from "./PlayRoot.demo.tsx?raw";
import { SidebarMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { SidebarMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";
import { SidebarMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";

export const sidebarMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-root", title: "play / set", Demo: SidebarMotionControllerDemo, source: playRootSource },
  { id: "events-ping", title: "events yoyo", Demo: SidebarMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-off", title: "events false", Demo: SidebarMotionEventsOffDemo, source: eventsOffSource },
  { id: "events-finished", title: "waitForComplete", Demo: SidebarMotionEventsFinishedDemo, source: eventsFinishedSource },
];

export function SidebarMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Sidebar MotionController demos"
      align="stretch"
      items={sidebarMotionControllerGallery}
    />
  );
}
