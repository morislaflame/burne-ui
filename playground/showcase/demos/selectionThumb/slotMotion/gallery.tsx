import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { SelectionThumbMotionInstantEnterDemo } from "./SelectionThumbMotionInstantEnter.demo";
import selectionThumbMotionInstantEnterSource from "./SelectionThumbMotionInstantEnter.demo.tsx?raw";
import { SelectionThumbMotionRootWaveDemo } from "./SelectionThumbMotionRootWave.demo";
import selectionThumbMotionRootWaveSource from "./SelectionThumbMotionRootWave.demo.tsx?raw";
import { SelectionThumbMotionEnterTintDemo } from "./SelectionThumbMotionEnterTint.demo";
import selectionThumbMotionEnterTintSource from "./SelectionThumbMotionEnterTint.demo.tsx?raw";

export const selectionThumbSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "instant-enter", title: "Instant enter", Demo: SelectionThumbMotionInstantEnterDemo, source: selectionThumbMotionInstantEnterSource },
  { id: "root-wave", title: "Root wave", Demo: SelectionThumbMotionRootWaveDemo, source: selectionThumbMotionRootWaveSource },
  { id: "enter-tint", title: "Enter tint", Demo: SelectionThumbMotionEnterTintDemo, source: selectionThumbMotionEnterTintSource },
];

export function SelectionThumbSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="SelectionThumb Slot motion demos"
      items={selectionThumbSlotMotionGallery}
    />
  );
}
