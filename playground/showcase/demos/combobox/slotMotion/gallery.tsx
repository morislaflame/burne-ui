import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { ComboBoxMotionInstantHoverDemo } from "./ComboBoxMotionInstantHover.demo";
import comboBoxMotionInstantHoverSource from "./ComboBoxMotionInstantHover.demo.tsx?raw";
import { ComboBoxMotionInputWaveDemo } from "./ComboBoxMotionInputWave.demo";
import comboBoxMotionInputWaveSource from "./ComboBoxMotionInputWave.demo.tsx?raw";
import { ComboBoxMotionInputTintDemo } from "./ComboBoxMotionInputTint.demo";
import comboBoxMotionInputTintSource from "./ComboBoxMotionInputTint.demo.tsx?raw";
import { ComboBoxMotionHintEnterDemo } from "./ComboBoxMotionHintEnter.demo";
import comboBoxMotionHintEnterSource from "./ComboBoxMotionHintEnter.demo.tsx?raw";

export const comboBoxSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "instant-hover", title: "Instant hover", Demo: ComboBoxMotionInstantHoverDemo, source: comboBoxMotionInstantHoverSource },
  { id: "input-wave", title: "Input wave", Demo: ComboBoxMotionInputWaveDemo, source: comboBoxMotionInputWaveSource },
  { id: "input-tint", title: "Input tint", Demo: ComboBoxMotionInputTintDemo, source: comboBoxMotionInputTintSource },
  { id: "hint-enter", title: "Hint enter", Demo: ComboBoxMotionHintEnterDemo, source: comboBoxMotionHintEnterSource },
];

export function ComboBoxSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="ComboBox Slot motion demos"
      align="stretch"
      items={comboBoxSlotMotionGallery}
    />
  );
}
