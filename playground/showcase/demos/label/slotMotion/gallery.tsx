import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { LabelMotionInstantEnterDemo } from "./LabelMotionInstantEnter.demo";
import labelMotionInstantEnterSource from "./LabelMotionInstantEnter.demo.tsx?raw";
import { LabelMotionRootWaveDemo } from "./LabelMotionRootWave.demo";
import labelMotionRootWaveSource from "./LabelMotionRootWave.demo.tsx?raw";
import { LabelMotionEnterTintDemo } from "./LabelMotionEnterTint.demo";
import labelMotionEnterTintSource from "./LabelMotionEnterTint.demo.tsx?raw";

export const labelSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "instant-enter", title: "Instant enter", Demo: LabelMotionInstantEnterDemo, source: labelMotionInstantEnterSource },
  { id: "root-wave", title: "Root wave", Demo: LabelMotionRootWaveDemo, source: labelMotionRootWaveSource },
  { id: "enter-tint", title: "Enter tint", Demo: LabelMotionEnterTintDemo, source: labelMotionEnterTintSource },
];

export function LabelSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Label Slot motion demos"
      items={labelSlotMotionGallery}
    />
  );
}
