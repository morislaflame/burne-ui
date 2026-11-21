import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { SeparatorMotionInstantEnterDemo } from "./SeparatorMotionInstantEnter.demo";
import separatorMotionInstantEnterSource from "./SeparatorMotionInstantEnter.demo.tsx?raw";
import { SeparatorMotionRootWaveDemo } from "./SeparatorMotionRootWave.demo";
import separatorMotionRootWaveSource from "./SeparatorMotionRootWave.demo.tsx?raw";
import { SeparatorMotionEnterTintDemo } from "./SeparatorMotionEnterTint.demo";
import separatorMotionEnterTintSource from "./SeparatorMotionEnterTint.demo.tsx?raw";

export const separatorSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "instant-enter", title: "Instant enter", Demo: SeparatorMotionInstantEnterDemo, source: separatorMotionInstantEnterSource },
  { id: "root-wave", title: "Root wave", Demo: SeparatorMotionRootWaveDemo, source: separatorMotionRootWaveSource },
  { id: "enter-tint", title: "Enter tint", Demo: SeparatorMotionEnterTintDemo, source: separatorMotionEnterTintSource },
];

export function SeparatorSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Separator Slot motion demos"
      align="stretch"
      items={separatorSlotMotionGallery}
    />
  );
}
