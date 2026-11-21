import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { CheckboxGroupMotionInstantEnterDemo } from "./CheckboxGroupMotionInstantEnter.demo";
import checkboxGroupMotionInstantEnterSource from "./CheckboxGroupMotionInstantEnter.demo.tsx?raw";
import { CheckboxGroupMotionRootWaveDemo } from "./CheckboxGroupMotionRootWave.demo";
import checkboxGroupMotionRootWaveSource from "./CheckboxGroupMotionRootWave.demo.tsx?raw";
import { CheckboxGroupMotionChangeTintDemo } from "./CheckboxGroupMotionChangeTint.demo";
import checkboxGroupMotionChangeTintSource from "./CheckboxGroupMotionChangeTint.demo.tsx?raw";
import { CheckboxGroupMotionHintEnterDemo } from "./CheckboxGroupMotionHintEnter.demo";
import checkboxGroupMotionHintEnterSource from "./CheckboxGroupMotionHintEnter.demo.tsx?raw";

export const checkboxGroupSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "instant-enter", title: "Instant enter", Demo: CheckboxGroupMotionInstantEnterDemo, source: checkboxGroupMotionInstantEnterSource },
  { id: "root-wave", title: "Root wave", Demo: CheckboxGroupMotionRootWaveDemo, source: checkboxGroupMotionRootWaveSource },
  { id: "change-tint", title: "Change tint", Demo: CheckboxGroupMotionChangeTintDemo, source: checkboxGroupMotionChangeTintSource },
  { id: "hint-enter", title: "Hint enter", Demo: CheckboxGroupMotionHintEnterDemo, source: checkboxGroupMotionHintEnterSource },
];

export function CheckboxGroupSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="CheckboxGroup Slot motion demos"
      align="stretch"
      items={checkboxGroupSlotMotionGallery}
    />
  );
}
