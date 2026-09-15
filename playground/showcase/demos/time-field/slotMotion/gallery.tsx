import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { TimeFieldMotionInstantHoverDemo } from "./TimeFieldMotionInstantHover.demo";
import timeFieldMotionInstantHoverSource from "./TimeFieldMotionInstantHover.demo.tsx?raw";
import { TimeFieldMotionAffixWaveDemo } from "./TimeFieldMotionAffixWave.demo";
import timeFieldMotionAffixWaveSource from "./TimeFieldMotionAffixWave.demo.tsx?raw";
import { TimeFieldMotionPrefixTintDemo } from "./TimeFieldMotionPrefixTint.demo";
import timeFieldMotionPrefixTintSource from "./TimeFieldMotionPrefixTint.demo.tsx?raw";
import { TimeFieldMotionHintEnterDemo } from "./TimeFieldMotionHintEnter.demo";
import timeFieldMotionHintEnterSource from "./TimeFieldMotionHintEnter.demo.tsx?raw";

export const timeFieldSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "instant-hover", title: "Instant hover", Demo: TimeFieldMotionInstantHoverDemo, source: timeFieldMotionInstantHoverSource },
  { id: "affix-wave", title: "Affix wave", Demo: TimeFieldMotionAffixWaveDemo, source: timeFieldMotionAffixWaveSource },
  { id: "prefix-tint", title: "Prefix tint", Demo: TimeFieldMotionPrefixTintDemo, source: timeFieldMotionPrefixTintSource },
  { id: "hint-enter", title: "Hint enter", Demo: TimeFieldMotionHintEnterDemo, source: timeFieldMotionHintEnterSource },
];

export function TimeFieldSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="TimeField Slot motion demos"
      align="stretch"
      items={timeFieldSlotMotionGallery}
    />
  );
}
