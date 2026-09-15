import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { SurfaceMotionInstantEnterDemo } from "./SurfaceMotionInstantEnter.demo";
import surfaceMotionInstantEnterSource from "./SurfaceMotionInstantEnter.demo.tsx?raw";
import { SurfaceMotionRootWaveDemo } from "./SurfaceMotionRootWave.demo";
import surfaceMotionRootWaveSource from "./SurfaceMotionRootWave.demo.tsx?raw";
import { SurfaceMotionEnterTintDemo } from "./SurfaceMotionEnterTint.demo";
import surfaceMotionEnterTintSource from "./SurfaceMotionEnterTint.demo.tsx?raw";
import { SurfaceMotionSpotlightDemo } from "./SurfaceMotionSpotlight.demo";
import surfaceMotionSpotlightSource from "./SurfaceMotionSpotlight.demo.tsx?raw";

export const surfaceSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "instant-enter", title: "Instant enter", Demo: SurfaceMotionInstantEnterDemo, source: surfaceMotionInstantEnterSource },
  { id: "root-wave", title: "Root wave", Demo: SurfaceMotionRootWaveDemo, source: surfaceMotionRootWaveSource },
  { id: "enter-tint", title: "Enter tint", Demo: SurfaceMotionEnterTintDemo, source: surfaceMotionEnterTintSource },
  { id: "spotlight", title: "Spotlight", Demo: SurfaceMotionSpotlightDemo, source: surfaceMotionSpotlightSource },
];

export function SurfaceSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Surface Slot motion demos"
      align="stretch"
      items={surfaceSlotMotionGallery}
    />
  );
}
