import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { TagsInputMotionAppearDemo } from "./Appear.demo";
import appearSource from "./Appear.demo.tsx?raw";
import { TagsInputMotionNudgeDemo } from "./Nudge.demo";
import nudgeSource from "./Nudge.demo.tsx?raw";

export const tagsInputSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "nudge", title: "Chip nudge", Demo: TagsInputMotionNudgeDemo, source: nudgeSource },
  { id: "appear", title: "Appear in order", Demo: TagsInputMotionAppearDemo, source: appearSource },
];

export function TagsInputSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="TagsInput Slot motion demos"
      align="start"
      items={tagsInputSlotMotionGallery}
    />
  );
}
