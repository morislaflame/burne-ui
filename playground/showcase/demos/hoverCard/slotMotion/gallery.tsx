import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { HoverCardMotionAppearDemo } from "./Appear.demo";
import appearSource from "./Appear.demo.tsx?raw";
import { HoverCardMotionNudgeDemo } from "./Nudge.demo";
import nudgeSource from "./Nudge.demo.tsx?raw";
import { HoverCardMotionTriggerDemo } from "./Trigger.demo";
import triggerSource from "./Trigger.demo.tsx?raw";

export const hoverCardSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "nudge", title: "Title nudge", Demo: HoverCardMotionNudgeDemo, source: nudgeSource },
  { id: "appear", title: "Appear in order", Demo: HoverCardMotionAppearDemo, source: appearSource },
  { id: "trigger", title: "Trigger nudge", Demo: HoverCardMotionTriggerDemo, source: triggerSource },
];

export function HoverCardSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery aria-label="HoverCard Slot motion demos" items={hoverCardSlotMotionGallery} />
  );
}
