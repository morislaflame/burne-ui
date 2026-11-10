import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { DrawerMotionControllerDemo } from "./PlayPanel.demo";
import playPanelSource from "./PlayPanel.demo.tsx?raw";
import { DrawerMotionControllerPlayVsSlotDemo } from "./PlayVsSlot.demo";
import playVsSlotSource from "./PlayVsSlot.demo.tsx?raw";
import { DrawerMotionControllerStaggerDemo } from "./Stagger.demo";
import staggerSource from "./Stagger.demo.tsx?raw";
import { DrawerMotionControllerExcludeDemo } from "./Exclude.demo";
import excludeSource from "./Exclude.demo.tsx?raw";
import { DrawerMotionControllerInsideDemo } from "./Inside.demo";
import insideSource from "./Inside.demo.tsx?raw";
import { DrawerMotionControllerCancelDemo } from "./Cancel.demo";
import cancelSource from "./Cancel.demo.tsx?raw";
import { DrawerMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { DrawerMotionEventsKickDemo } from "./EventsKick.demo";
import eventsKickSource from "./EventsKick.demo.tsx?raw";
import { DrawerMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { DrawerMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";

export const drawerMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-panel", title: "playSlot / set", Demo: DrawerMotionControllerDemo, source: playPanelSource },
  { id: "play-vs-slot", title: "playSlot vs playAll", Demo: DrawerMotionControllerPlayVsSlotDemo, source: playVsSlotSource },
  { id: "stagger", title: "playAll stagger", Demo: DrawerMotionControllerStaggerDemo, source: staggerSource },
  { id: "exclude", title: "exclude title", Demo: DrawerMotionControllerExcludeDemo, source: excludeSource },
  { id: "inside", title: "inside tree", Demo: DrawerMotionControllerInsideDemo, source: insideSource },
  { id: "cancel", title: "cancel loop", Demo: DrawerMotionControllerCancelDemo, source: cancelSource },
  { id: "events-ping", title: "events yoyo", Demo: DrawerMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-kick", title: "kick targets", Demo: DrawerMotionEventsKickDemo, source: eventsKickSource },
  { id: "events-finished", title: "waitForComplete", Demo: DrawerMotionEventsFinishedDemo, source: eventsFinishedSource },
  { id: "events-off", title: "events false", Demo: DrawerMotionEventsOffDemo, source: eventsOffSource },
];

export function DrawerMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Drawer MotionController demos"
      align="stretch"
      items={drawerMotionControllerGallery}
    />
  );
}
