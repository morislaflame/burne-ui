import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { CloseButtonMotionDrawXDemo } from "./CloseButtonMotionDrawX.demo";
import closeButtonMotionDrawXSource from "./CloseButtonMotionDrawX.demo.tsx?raw";
import { CloseButtonMotionIconTintDemo } from "./CloseButtonMotionIconTint.demo";
import closeButtonMotionIconTintSource from "./CloseButtonMotionIconTint.demo.tsx?raw";
import { CloseButtonMotionIconWaveDemo } from "./CloseButtonMotionIconWave.demo";
import closeButtonMotionIconWaveSource from "./CloseButtonMotionIconWave.demo.tsx?raw";
import { CloseButtonMotionInstantHoverDemo } from "./CloseButtonMotionInstantHover.demo";
import closeButtonMotionInstantHoverSource from "./CloseButtonMotionInstantHover.demo.tsx?raw";

export const closeButtonSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "instant-hover", title: "Instant hover", Demo: CloseButtonMotionInstantHoverDemo, source: closeButtonMotionInstantHoverSource },
  { id: "icon-wave", title: "Icon wave", Demo: CloseButtonMotionIconWaveDemo, source: closeButtonMotionIconWaveSource },
  { id: "icon-tint", title: "Icon tint", Demo: CloseButtonMotionIconTintDemo, source: closeButtonMotionIconTintSource },
  { id: "draw-x", title: "DrawSVG X", Demo: CloseButtonMotionDrawXDemo, source: closeButtonMotionDrawXSource },
];

export function CloseButtonSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="CloseButton Slot motion demos"
      items={closeButtonSlotMotionGallery}
    />
  );
}
