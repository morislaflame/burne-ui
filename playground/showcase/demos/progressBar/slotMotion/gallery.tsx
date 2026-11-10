import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { ProgressBarMotionInstantEnterDemo } from "./ProgressBarMotionInstantEnter.demo";
import progressBarMotionInstantEnterSource from "./ProgressBarMotionInstantEnter.demo.tsx?raw";
import { ProgressBarMotionFillEnterDemo } from "./ProgressBarMotionFillEnter.demo";
import progressBarMotionFillEnterSource from "./ProgressBarMotionFillEnter.demo.tsx?raw";
import { ProgressBarMotionTrackWaveDemo } from "./ProgressBarMotionTrackWave.demo";
import progressBarMotionTrackWaveSource from "./ProgressBarMotionTrackWave.demo.tsx?raw";
import { ProgressBarMotionChangeTintDemo } from "./ProgressBarMotionChangeTint.demo";
import progressBarMotionChangeTintSource from "./ProgressBarMotionChangeTint.demo.tsx?raw";
import { ProgressBarMotionHintEnterDemo } from "./ProgressBarMotionHintEnter.demo";
import progressBarMotionHintEnterSource from "./ProgressBarMotionHintEnter.demo.tsx?raw";
import { ProgressBarMotionFillSheenDemo } from "./ProgressBarMotionFillSheen.demo";
import progressBarMotionFillSheenSource from "./ProgressBarMotionFillSheen.demo.tsx?raw";

export const progressBarSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "instant-enter", title: "Instant enter", Demo: ProgressBarMotionInstantEnterDemo, source: progressBarMotionInstantEnterSource },
  { id: "fill-enter", title: "Fill enter", Demo: ProgressBarMotionFillEnterDemo, source: progressBarMotionFillEnterSource },
  { id: "track-wave", title: "Track wave", Demo: ProgressBarMotionTrackWaveDemo, source: progressBarMotionTrackWaveSource },
  { id: "change-tint", title: "Change tint", Demo: ProgressBarMotionChangeTintDemo, source: progressBarMotionChangeTintSource },
  { id: "hint-enter", title: "Hint enter", Demo: ProgressBarMotionHintEnterDemo, source: progressBarMotionHintEnterSource },
  { id: "fill-sheen", title: "Fill sheen", Demo: ProgressBarMotionFillSheenDemo, source: progressBarMotionFillSheenSource },
];

export function ProgressBarSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="ProgressBar Slot motion demos"
      align="stretch"
      items={progressBarSlotMotionGallery}
    />
  );
}
