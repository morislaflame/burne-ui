import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { SliderMotionInstantPressDemo } from "./SliderMotionInstantPress.demo";
import sliderMotionInstantPressSource from "./SliderMotionInstantPress.demo.tsx?raw";
import { SliderMotionChangeTintDemo } from "./SliderMotionChangeTint.demo";
import sliderMotionChangeTintSource from "./SliderMotionChangeTint.demo.tsx?raw";
import { SliderMotionThumbInertiaDemo } from "./SliderMotionThumbInertia.demo";
import sliderMotionThumbInertiaSource from "./SliderMotionThumbInertia.demo.tsx?raw";
import { SliderMotionValuePopDemo } from "./SliderMotionValuePop.demo";
import sliderMotionValuePopSource from "./SliderMotionValuePop.demo.tsx?raw";
import { SliderMotionRangeSplitDemo } from "./SliderMotionRangeSplit.demo";
import sliderMotionRangeSplitSource from "./SliderMotionRangeSplit.demo.tsx?raw";
import { SliderMotionTrackGlowDemo } from "./SliderMotionTrackGlow.demo";
import sliderMotionTrackGlowSource from "./SliderMotionTrackGlow.demo.tsx?raw";
import { SliderMotionHintEnterDemo } from "./SliderMotionHintEnter.demo";
import sliderMotionHintEnterSource from "./SliderMotionHintEnter.demo.tsx?raw";

export const sliderSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "instant-press", title: "Instant press", Demo: SliderMotionInstantPressDemo, source: sliderMotionInstantPressSource },
  { id: "change-tint", title: "Change tint", Demo: SliderMotionChangeTintDemo, source: sliderMotionChangeTintSource },
  { id: "thumb-inertia", title: "Thumb inertia", Demo: SliderMotionThumbInertiaDemo, source: sliderMotionThumbInertiaSource },
  { id: "value-pop", title: "Value pop", Demo: SliderMotionValuePopDemo, source: sliderMotionValuePopSource },
  { id: "range-split", title: "Range split", Demo: SliderMotionRangeSplitDemo, source: sliderMotionRangeSplitSource },
  { id: "track-glow", title: "Track glow", Demo: SliderMotionTrackGlowDemo, source: sliderMotionTrackGlowSource },
  { id: "hint-enter", title: "Hint enter", Demo: SliderMotionHintEnterDemo, source: sliderMotionHintEnterSource },
];

export function SliderSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Slider Slot motion demos"
      align="stretch"
      items={sliderSlotMotionGallery}
    />
  );
}
