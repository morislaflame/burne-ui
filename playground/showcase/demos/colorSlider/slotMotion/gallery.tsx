import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { ColorSliderMotionInstantEnterDemo } from "./ColorSliderMotionInstantEnter.demo";
import colorSliderMotionInstantEnterSource from "./ColorSliderMotionInstantEnter.demo.tsx?raw";
import { ColorSliderMotionTrackWaveDemo } from "./ColorSliderMotionTrackWave.demo";
import colorSliderMotionTrackWaveSource from "./ColorSliderMotionTrackWave.demo.tsx?raw";
import { ColorSliderMotionChangeTintDemo } from "./ColorSliderMotionChangeTint.demo";
import colorSliderMotionChangeTintSource from "./ColorSliderMotionChangeTint.demo.tsx?raw";

export const colorSliderSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "instant-enter", title: "Instant enter", Demo: ColorSliderMotionInstantEnterDemo, source: colorSliderMotionInstantEnterSource },
  { id: "track-wave", title: "Track wave", Demo: ColorSliderMotionTrackWaveDemo, source: colorSliderMotionTrackWaveSource },
  { id: "change-tint", title: "Change tint", Demo: ColorSliderMotionChangeTintDemo, source: colorSliderMotionChangeTintSource },
];

export function ColorSliderSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="ColorSlider Slot motion demos"
      align="stretch"
      items={colorSliderSlotMotionGallery}
    />
  );
}
