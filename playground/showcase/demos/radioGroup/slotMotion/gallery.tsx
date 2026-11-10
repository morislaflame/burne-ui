import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { RadioGroupMotionInstantEnterDemo } from "./RadioGroupMotionInstantEnter.demo";
import radioGroupMotionInstantEnterSource from "./RadioGroupMotionInstantEnter.demo.tsx?raw";
import { RadioGroupMotionChangeTintDemo } from "./RadioGroupMotionChangeTint.demo";
import radioGroupMotionChangeTintSource from "./RadioGroupMotionChangeTint.demo.tsx?raw";
import { RadioGroupMotionHintEnterDemo } from "./RadioGroupMotionHintEnter.demo";
import radioGroupMotionHintEnterSource from "./RadioGroupMotionHintEnter.demo.tsx?raw";

export const radioGroupSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "instant-enter", title: "Instant enter", Demo: RadioGroupMotionInstantEnterDemo, source: radioGroupMotionInstantEnterSource },
  { id: "change-tint", title: "Change tint", Demo: RadioGroupMotionChangeTintDemo, source: radioGroupMotionChangeTintSource },
  { id: "hint-enter", title: "Hint enter", Demo: RadioGroupMotionHintEnterDemo, source: radioGroupMotionHintEnterSource },
];

export function RadioGroupSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="RadioGroup Slot motion demos"
      align="stretch"
      items={radioGroupSlotMotionGallery}
    />
  );
}
