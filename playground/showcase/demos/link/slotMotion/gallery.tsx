import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { LinkMotionInstantHoverDemo } from "./LinkMotionInstantHover.demo";
import linkMotionInstantHoverSource from "./LinkMotionInstantHover.demo.tsx?raw";
import { LinkMotionSplitCharsDemo } from "./LinkMotionSplitChars.demo";
import linkMotionSplitCharsSource from "./LinkMotionSplitChars.demo.tsx?raw";
import { LinkMotionTextTintDemo } from "./LinkMotionTextTint.demo";
import linkMotionTextTintSource from "./LinkMotionTextTint.demo.tsx?raw";
import { LinkMotionTextWaveDemo } from "./LinkMotionTextWave.demo";
import linkMotionTextWaveSource from "./LinkMotionTextWave.demo.tsx?raw";

export const linkSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "instant-hover", title: "Instant hover", Demo: LinkMotionInstantHoverDemo, source: linkMotionInstantHoverSource },
  { id: "text-wave", title: "Text wave", Demo: LinkMotionTextWaveDemo, source: linkMotionTextWaveSource },
  { id: "text-tint", title: "Text tint", Demo: LinkMotionTextTintDemo, source: linkMotionTextTintSource },
  { id: "split-chars", title: "SplitText chars", Demo: LinkMotionSplitCharsDemo, source: linkMotionSplitCharsSource },
];

export function LinkSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Link Slot motion demos"
      items={linkSlotMotionGallery}
    />
  );
}
