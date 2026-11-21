import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { FieldMotionInstantEnterDemo } from "./FieldMotionInstantEnter.demo";
import fieldMotionInstantEnterSource from "./FieldMotionInstantEnter.demo.tsx?raw";
import { FieldMotionRootWaveDemo } from "./FieldMotionRootWave.demo";
import fieldMotionRootWaveSource from "./FieldMotionRootWave.demo.tsx?raw";
import { FieldMotionErrorTintDemo } from "./FieldMotionErrorTint.demo";
import fieldMotionErrorTintSource from "./FieldMotionErrorTint.demo.tsx?raw";
import { FieldMotionLabelHintDemo } from "./FieldMotionLabelHint.demo";
import fieldMotionLabelHintSource from "./FieldMotionLabelHint.demo.tsx?raw";

export const fieldSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "instant-enter", title: "Instant enter", Demo: FieldMotionInstantEnterDemo, source: fieldMotionInstantEnterSource },
  { id: "root-wave", title: "Root wave", Demo: FieldMotionRootWaveDemo, source: fieldMotionRootWaveSource },
  { id: "error-tint", title: "Error tint", Demo: FieldMotionErrorTintDemo, source: fieldMotionErrorTintSource },
  { id: "label-hint", title: "Label hint", Demo: FieldMotionLabelHintDemo, source: fieldMotionLabelHintSource },
];

export function FieldSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Field Slot motion demos"
      align="stretch"
      items={fieldSlotMotionGallery}
    />
  );
}
