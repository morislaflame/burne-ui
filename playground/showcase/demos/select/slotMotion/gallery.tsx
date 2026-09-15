import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { SelectMotionInstantHoverDemo } from "./SelectMotionInstantHover.demo";
import selectMotionInstantHoverSource from "./SelectMotionInstantHover.demo.tsx?raw";
import { SelectMotionTriggerWaveDemo } from "./SelectMotionTriggerWave.demo";
import selectMotionTriggerWaveSource from "./SelectMotionTriggerWave.demo.tsx?raw";
import { SelectMotionValueTintDemo } from "./SelectMotionValueTint.demo";
import selectMotionValueTintSource from "./SelectMotionValueTint.demo.tsx?raw";
import { SelectMotionHintEnterDemo } from "./SelectMotionHintEnter.demo";
import selectMotionHintEnterSource from "./SelectMotionHintEnter.demo.tsx?raw";

export const selectSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "instant-hover", title: "Instant hover", Demo: SelectMotionInstantHoverDemo, source: selectMotionInstantHoverSource },
  { id: "trigger-wave", title: "Trigger wave", Demo: SelectMotionTriggerWaveDemo, source: selectMotionTriggerWaveSource },
  { id: "value-tint", title: "Value tint", Demo: SelectMotionValueTintDemo, source: selectMotionValueTintSource },
  { id: "hint-enter", title: "Hint enter", Demo: SelectMotionHintEnterDemo, source: selectMotionHintEnterSource },
];

export function SelectSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Select Slot motion demos"
      align="stretch"
      items={selectSlotMotionGallery}
    />
  );
}
