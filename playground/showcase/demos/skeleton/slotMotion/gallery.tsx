import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { SkeletonMotionInstantEnterDemo } from "./SkeletonMotionInstantEnter.demo";
import skeletonMotionInstantEnterSource from "./SkeletonMotionInstantEnter.demo.tsx?raw";
import { SkeletonMotionRootWaveDemo } from "./SkeletonMotionRootWave.demo";
import skeletonMotionRootWaveSource from "./SkeletonMotionRootWave.demo.tsx?raw";
import { SkeletonMotionRegionEnterDemo } from "./SkeletonMotionRegionEnter.demo";
import skeletonMotionRegionEnterSource from "./SkeletonMotionRegionEnter.demo.tsx?raw";
import { SkeletonMotionRegionGrayscaleDemo } from "./SkeletonMotionRegionGrayscale.demo";
import skeletonMotionRegionGrayscaleSource from "./SkeletonMotionRegionGrayscale.demo.tsx?raw";

export const skeletonSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "instant-enter", title: "Instant enter", Demo: SkeletonMotionInstantEnterDemo, source: skeletonMotionInstantEnterSource },
  { id: "root-wave", title: "Root wave", Demo: SkeletonMotionRootWaveDemo, source: skeletonMotionRootWaveSource },
  { id: "region-enter", title: "Region enter", Demo: SkeletonMotionRegionEnterDemo, source: skeletonMotionRegionEnterSource },
  { id: "region-grayscale", title: "Region grayscale", Demo: SkeletonMotionRegionGrayscaleDemo, source: skeletonMotionRegionGrayscaleSource },
];

export function SkeletonSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Skeleton Slot motion demos"
      align="stretch"
      items={skeletonSlotMotionGallery}
    />
  );
}
