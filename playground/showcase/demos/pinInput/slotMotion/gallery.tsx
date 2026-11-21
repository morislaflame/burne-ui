import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { PinInputMotionChromeDemo } from "./Chrome.demo";
import chromeSource from "./Chrome.demo.tsx?raw";
import { PinInputMotionHoverOffDemo } from "./HoverOff.demo";
import hoverOffSource from "./HoverOff.demo.tsx?raw";
import { PinInputMotionNudgeDemo } from "./Nudge.demo";
import nudgeSource from "./Nudge.demo.tsx?raw";
import { PinInputMotionOriginDemo } from "./Origin.demo";
import originSource from "./Origin.demo.tsx?raw";
import { PinInputMotionStaggerDemo } from "./Stagger.demo";
import staggerSource from "./Stagger.demo.tsx?raw";

export const pinInputSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "hover-off", title: "Hover off", Demo: PinInputMotionHoverOffDemo, source: hoverOffSource },
  { id: "nudge", title: "Cell nudge", Demo: PinInputMotionNudgeDemo, source: nudgeSource },
  { id: "chrome", title: "Label hint error", Demo: PinInputMotionChromeDemo, source: chromeSource },
  { id: "stagger", title: "Cells in order", Demo: PinInputMotionStaggerDemo, source: staggerSource },
  { id: "origin", title: "Cell origin", Demo: PinInputMotionOriginDemo, source: originSource },
];

export function PinInputSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="PinInput Slot motion demos"
      align="start"
      items={pinInputSlotMotionGallery}
    />
  );
}
