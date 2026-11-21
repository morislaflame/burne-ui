import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { SearchInputMotionControllerClearDemo } from "./ClearSlot.demo";
import clearSlotSource from "./ClearSlot.demo.tsx?raw";
import { SearchInputMotionEventsFinishedDemo } from "./EventsFinished.demo";
import eventsFinishedSource from "./EventsFinished.demo.tsx?raw";
import { SearchInputMotionEventsMatchDemo } from "./EventsMatch.demo";
import eventsMatchSource from "./EventsMatch.demo.tsx?raw";
import { SearchInputMotionEventsNudgeDemo } from "./EventsNudge.demo";
import eventsNudgeSource from "./EventsNudge.demo.tsx?raw";
import { SearchInputMotionEventsOffDemo } from "./EventsOff.demo";
import eventsOffSource from "./EventsOff.demo.tsx?raw";
import { SearchInputMotionEventsSpinDemo } from "./EventsSpin.demo";
import eventsSpinSource from "./EventsSpin.demo.tsx?raw";
import { SearchInputMotionControllerExcludeDemo } from "./Exclude.demo";
import excludeSource from "./Exclude.demo.tsx?raw";
import { SearchInputMotionControllerDemo } from "./PlayRoot.demo";
import playRootSource from "./PlayRoot.demo.tsx?raw";
import { SearchInputMotionControllerPlayVsSlotDemo } from "./PlayVsSlot.demo";
import playVsSlotSource from "./PlayVsSlot.demo.tsx?raw";
import { SearchInputMotionControllerStaggerDemo } from "./Stagger.demo";
import staggerSource from "./Stagger.demo.tsx?raw";

export const searchInputMotionControllerGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "play-root", title: "playSlot / set", Demo: SearchInputMotionControllerDemo, source: playRootSource },
  { id: "play-vs-slot", title: "play vs playSlot", Demo: SearchInputMotionControllerPlayVsSlotDemo, source: playVsSlotSource },
  { id: "clear", title: "clear slot", Demo: SearchInputMotionControllerClearDemo, source: clearSlotSource },
  { id: "stagger", title: "playAll stagger", Demo: SearchInputMotionControllerStaggerDemo, source: staggerSource },
  { id: "exclude", title: "exclude shell", Demo: SearchInputMotionControllerExcludeDemo, source: excludeSource },
  { id: "events-nudge", title: "events yoyo", Demo: SearchInputMotionEventsNudgeDemo, source: eventsNudgeSource },
  { id: "events-spin", title: "icon timeline", Demo: SearchInputMotionEventsSpinDemo, source: eventsSpinSource },
  { id: "events-match", title: "icon + clear", Demo: SearchInputMotionEventsMatchDemo, source: eventsMatchSource },
  { id: "events-finished", title: "waitForComplete", Demo: SearchInputMotionEventsFinishedDemo, source: eventsFinishedSource },
  { id: "events-off", title: "events false", Demo: SearchInputMotionEventsOffDemo, source: eventsOffSource },
];

export function SearchInputMotionControllerGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="SearchInput MotionController demos"
      items={searchInputMotionControllerGallery}
    />
  );
}
