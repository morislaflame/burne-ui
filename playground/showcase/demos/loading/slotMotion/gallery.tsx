import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { LoadingMotionInstantEnterDemo } from "./LoadingMotionInstantEnter.demo";
import loadingMotionInstantEnterSource from "./LoadingMotionInstantEnter.demo.tsx?raw";
import { LoadingMotionRootWaveDemo } from "./LoadingMotionRootWave.demo";
import loadingMotionRootWaveSource from "./LoadingMotionRootWave.demo.tsx?raw";
import { LoadingMotionEnterTintDemo } from "./LoadingMotionEnterTint.demo";
import loadingMotionEnterTintSource from "./LoadingMotionEnterTint.demo.tsx?raw";
import { LoadingMotionFilterPulseDemo } from "./LoadingMotionFilterPulse.demo";
import loadingMotionFilterPulseSource from "./LoadingMotionFilterPulse.demo.tsx?raw";

export const loadingSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "instant-enter", title: "Instant enter", Demo: LoadingMotionInstantEnterDemo, source: loadingMotionInstantEnterSource },
  { id: "root-wave", title: "Root wave", Demo: LoadingMotionRootWaveDemo, source: loadingMotionRootWaveSource },
  { id: "enter-tint", title: "Enter tint", Demo: LoadingMotionEnterTintDemo, source: loadingMotionEnterTintSource },
  { id: "filter-pulse", title: "Filter pulse", Demo: LoadingMotionFilterPulseDemo, source: loadingMotionFilterPulseSource },
];

export function LoadingSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Loading Slot motion demos"
      items={loadingSlotMotionGallery}
    />
  );
}
