import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { ScrollAreaMotionChromeDemo } from "./Chrome.demo";
import chromeSource from "./Chrome.demo.tsx?raw";
import { ScrollAreaMotionNudgeDemo } from "./Nudge.demo";
import nudgeSource from "./Nudge.demo.tsx?raw";
import { ScrollAreaMotionOriginDemo } from "./Origin.demo";
import originSource from "./Origin.demo.tsx?raw";
import { ScrollAreaMotionStaggerDemo } from "./Stagger.demo";
import staggerSource from "./Stagger.demo.tsx?raw";

export const scrollAreaSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "nudge", title: "Thumb nudge", Demo: ScrollAreaMotionNudgeDemo, source: nudgeSource },
  { id: "chrome", title: "Thumb color", Demo: ScrollAreaMotionChromeDemo, source: chromeSource },
  { id: "stagger", title: "Bars in order", Demo: ScrollAreaMotionStaggerDemo, source: staggerSource },
  { id: "origin", title: "Thumb origin", Demo: ScrollAreaMotionOriginDemo, source: originSource },
];

export function ScrollAreaSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="ScrollArea Slot motion demos"
      align="start"
      items={scrollAreaSlotMotionGallery}
    />
  );
}
