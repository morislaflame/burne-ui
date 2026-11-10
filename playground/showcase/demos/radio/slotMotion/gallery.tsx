import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { RadioMotionCornerFillDemo } from "./RadioMotionCornerFill.demo";
import radioMotionCornerFillSource from "./RadioMotionCornerFill.demo.tsx?raw";
import { RadioMotionSpinningMarkDemo } from "./RadioMotionSpinningMark.demo";
import radioMotionSpinningMarkSource from "./RadioMotionSpinningMark.demo.tsx?raw";
import { RadioMotionFillMarkStaggerDemo } from "./RadioMotionFillMarkStagger.demo";
import radioMotionFillMarkStaggerSource from "./RadioMotionFillMarkStagger.demo.tsx?raw";

export const radioSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "corner-fill", title: "Corner fill", Demo: RadioMotionCornerFillDemo, source: radioMotionCornerFillSource },
  { id: "spinning-mark", title: "Spinning mark", Demo: RadioMotionSpinningMarkDemo, source: radioMotionSpinningMarkSource },
  { id: "fill-mark-stagger", title: "Fill mark stagger", Demo: RadioMotionFillMarkStaggerDemo, source: radioMotionFillMarkStaggerSource },
];

export function RadioSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Radio Slot motion demos"
      align="stretch"
      items={radioSlotMotionGallery}
    />
  );
}
