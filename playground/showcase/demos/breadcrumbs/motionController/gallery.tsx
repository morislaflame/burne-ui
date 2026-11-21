import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { BreadcrumbsMotionControllerCancelDemo } from "./Cancel.demo";
import cancelSource from "./Cancel.demo.tsx?raw";
import { BreadcrumbsMotionControllerExcludeDemo } from "./Exclude.demo";
import excludeSource from "./Exclude.demo.tsx?raw";
import { BreadcrumbsMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { BreadcrumbsMotionEventsKickDemo } from "./EventsKick.demo";
import eventsKickSource from "./EventsKick.demo.tsx?raw";
import { BreadcrumbsMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";
import { BreadcrumbsMotionEventsPingDemo } from "./EventsPing.demo";
import eventsPingSource from "./EventsPing.demo.tsx?raw";
import { BreadcrumbsMotionControllerInsideDemo } from "./Inside.demo";
import insideSource from "./Inside.demo.tsx?raw";
import { BreadcrumbsMotionControllerPlayItemDemo } from "./PlayItem.demo";
import playItemSource from "./PlayItem.demo.tsx?raw";
import { BreadcrumbsMotionControllerDemo } from "./PlayList.demo";
import playListSource from "./PlayList.demo.tsx?raw";
import { BreadcrumbsMotionControllerPlayVsSlotDemo } from "./PlayVsSlot.demo";
import playVsSlotSource from "./PlayVsSlot.demo.tsx?raw";
import { BreadcrumbsMotionControllerStaggerDemo } from "./Stagger.demo";
import staggerSource from "./Stagger.demo.tsx?raw";

export const breadcrumbsMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-list", title: "playSlot list", Demo: BreadcrumbsMotionControllerDemo, source: playListSource },
  { id: "play-vs-slot", title: "play vs playSlot", Demo: BreadcrumbsMotionControllerPlayVsSlotDemo, source: playVsSlotSource },
  { id: "stagger", title: "playAll separators", Demo: BreadcrumbsMotionControllerStaggerDemo, source: staggerSource },
  { id: "play-item", title: "playSlot(itemLink)", Demo: BreadcrumbsMotionControllerPlayItemDemo, source: playItemSource },
  { id: "exclude", title: "exclude list", Demo: BreadcrumbsMotionControllerExcludeDemo, source: excludeSource },
  { id: "inside", title: "inside tree", Demo: BreadcrumbsMotionControllerInsideDemo, source: insideSource },
  { id: "cancel", title: "cancel loop", Demo: BreadcrumbsMotionControllerCancelDemo, source: cancelSource },
  { id: "events-ping", title: "events yoyo", Demo: BreadcrumbsMotionEventsPingDemo, source: eventsPingSource },
  { id: "events-kick", title: "breadcrumbs:scan targets", Demo: BreadcrumbsMotionEventsKickDemo, source: eventsKickSource },
  { id: "events-finished", title: "waitForComplete", Demo: BreadcrumbsMotionEventsFinishedDemo, source: eventsFinishedSource },
  { id: "events-off", title: "events false", Demo: BreadcrumbsMotionEventsOffDemo, source: eventsOffSource },
];

export function BreadcrumbsMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Breadcrumbs MotionController demos"
      align="stretch"
      items={breadcrumbsMotionControllerGallery}
    />
  );
}
