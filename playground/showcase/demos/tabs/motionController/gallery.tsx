import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { TabsMotionControllerCancelDemo } from "./Cancel.demo";
import cancelSource from "./Cancel.demo.tsx?raw";
import { TabsMotionControllerExcludeDemo } from "./Exclude.demo";
import excludeSource from "./Exclude.demo.tsx?raw";
import { TabsMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { TabsMotionEventsKickDemo } from "./EventsKick.demo";
import eventsKickSource from "./EventsKick.demo.tsx?raw";
import { TabsMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";
import { TabsMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { TabsMotionControllerInsideDemo } from "./Inside.demo";
import insideSource from "./Inside.demo.tsx?raw";
import { TabsMotionControllerPlayPanelDemo } from "./PlayPanel.demo";
import playPanelSource from "./PlayPanel.demo.tsx?raw";
import { TabsMotionControllerDemo } from "./PlayRoot.demo";
import playRootSource from "./PlayRoot.demo.tsx?raw";
import { TabsMotionControllerPlayTabDemo } from "./PlayTab.demo";
import playTabSource from "./PlayTab.demo.tsx?raw";
import { TabsMotionControllerPlayVsSlotDemo } from "./PlayVsSlot.demo";
import playVsSlotSource from "./PlayVsSlot.demo.tsx?raw";
import { TabsMotionControllerStaggerDemo } from "./Stagger.demo";
import staggerSource from "./Stagger.demo.tsx?raw";

export const tabsMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-root", title: "play / set", Demo: TabsMotionControllerDemo, source: playRootSource },
  { id: "play-vs-slot", title: "play vs playSlot", Demo: TabsMotionControllerPlayVsSlotDemo, source: playVsSlotSource },
  { id: "play-tab", title: "playSlot(tab)", Demo: TabsMotionControllerPlayTabDemo, source: playTabSource },
  { id: "play-panel", title: "playSlot(panel)", Demo: TabsMotionControllerPlayPanelDemo, source: playPanelSource },
  { id: "stagger", title: "playAll stagger", Demo: TabsMotionControllerStaggerDemo, source: staggerSource },
  { id: "exclude", title: "exclude list", Demo: TabsMotionControllerExcludeDemo, source: excludeSource },
  { id: "inside", title: "inside tree", Demo: TabsMotionControllerInsideDemo, source: insideSource },
  { id: "cancel", title: "cancel loop", Demo: TabsMotionControllerCancelDemo, source: cancelSource },
  { id: "events-ping", title: "events yoyo", Demo: TabsMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-kick", title: "tabs:kick targets", Demo: TabsMotionEventsKickDemo, source: eventsKickSource },
  { id: "events-finished", title: "waitForComplete", Demo: TabsMotionEventsFinishedDemo, source: eventsFinishedSource },
  { id: "events-off", title: "events false", Demo: TabsMotionEventsOffDemo, source: eventsOffSource },
];

export function TabsMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Tabs MotionController demos"
      align="stretch"
      items={tabsMotionControllerGallery}
    />
  );
}
