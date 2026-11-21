import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { MeterMotionInstantEnterDemo } from "./MeterMotionInstantEnter.demo";
import meterMotionInstantEnterSource from "./MeterMotionInstantEnter.demo.tsx?raw";
import { MeterMotionFillEnterDemo } from "./MeterMotionFillEnter.demo";
import meterMotionFillEnterSource from "./MeterMotionFillEnter.demo.tsx?raw";
import { MeterMotionTrackWaveDemo } from "./MeterMotionTrackWave.demo";
import meterMotionTrackWaveSource from "./MeterMotionTrackWave.demo.tsx?raw";
import { MeterMotionChangeTintDemo } from "./MeterMotionChangeTint.demo";
import meterMotionChangeTintSource from "./MeterMotionChangeTint.demo.tsx?raw";
import { MeterMotionHintEnterDemo } from "./MeterMotionHintEnter.demo";
import meterMotionHintEnterSource from "./MeterMotionHintEnter.demo.tsx?raw";
import { MeterMotionFillGlowDemo } from "./MeterMotionFillGlow.demo";
import meterMotionFillGlowSource from "./MeterMotionFillGlow.demo.tsx?raw";

export const meterSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "instant-enter", title: "Instant enter", Demo: MeterMotionInstantEnterDemo, source: meterMotionInstantEnterSource },
  { id: "fill-enter", title: "Fill enter", Demo: MeterMotionFillEnterDemo, source: meterMotionFillEnterSource },
  { id: "track-wave", title: "Track wave", Demo: MeterMotionTrackWaveDemo, source: meterMotionTrackWaveSource },
  { id: "change-tint", title: "Change tint", Demo: MeterMotionChangeTintDemo, source: meterMotionChangeTintSource },
  { id: "hint-enter", title: "Hint enter", Demo: MeterMotionHintEnterDemo, source: meterMotionHintEnterSource },
  { id: "fill-glow", title: "Fill glow", Demo: MeterMotionFillGlowDemo, source: meterMotionFillGlowSource },
];

export function MeterSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Meter Slot motion demos"
      align="stretch"
      items={meterSlotMotionGallery}
    />
  );
}
