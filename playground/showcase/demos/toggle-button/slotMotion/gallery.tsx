import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { ToggleButtonMotionDefaultDemo } from "./ToggleButtonMotionDefault.demo";
import toggleButtonMotionDefaultSource from "./ToggleButtonMotionDefault.demo.tsx?raw";
import { ToggleButtonMotionFillFromBottomDemo } from "./ToggleButtonMotionFillFromBottom.demo";
import toggleButtonMotionFillFromBottomSource from "./ToggleButtonMotionFillFromBottom.demo.tsx?raw";
import { ToggleButtonMotionInstantFillDemo } from "./ToggleButtonMotionInstantFill.demo";
import toggleButtonMotionInstantFillSource from "./ToggleButtonMotionInstantFill.demo.tsx?raw";
import { ToggleButtonMotionIconSpinDemo } from "./ToggleButtonMotionIconSpin.demo";
import toggleButtonMotionIconSpinSource from "./ToggleButtonMotionIconSpin.demo.tsx?raw";
import { ToggleButtonMotionMorphHeartDemo } from "./ToggleButtonMotionMorphHeart.demo";
import toggleButtonMotionMorphHeartSource from "./ToggleButtonMotionMorphHeart.demo.tsx?raw";
import { ToggleButtonMotionPerPartDemo } from "./ToggleButtonMotionPerPart.demo";
import toggleButtonMotionPerPartSource from "./ToggleButtonMotionPerPart.demo.tsx?raw";
import { ToggleButtonMotionTextTintDemo } from "./ToggleButtonMotionTextTint.demo";
import toggleButtonMotionTextTintSource from "./ToggleButtonMotionTextTint.demo.tsx?raw";

export const toggleButtonSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "default", title: "Default", Demo: ToggleButtonMotionDefaultDemo, source: toggleButtonMotionDefaultSource },
  { id: "instant-fill", title: "Instant fill", Demo: ToggleButtonMotionInstantFillDemo, source: toggleButtonMotionInstantFillSource },
  { id: "fill-from-bottom", title: "Fill from bottom", Demo: ToggleButtonMotionFillFromBottomDemo, source: toggleButtonMotionFillFromBottomSource },
  { id: "icon-spin", title: "Icon spin", Demo: ToggleButtonMotionIconSpinDemo, source: toggleButtonMotionIconSpinSource },
  { id: "text-tint", title: "Text tint", Demo: ToggleButtonMotionTextTintDemo, source: toggleButtonMotionTextTintSource },
  { id: "per-part", title: "Per part", Demo: ToggleButtonMotionPerPartDemo, source: toggleButtonMotionPerPartSource },
  { id: "morph-heart", title: "MorphSVG heart", Demo: ToggleButtonMotionMorphHeartDemo, source: toggleButtonMotionMorphHeartSource },
];

export function ToggleButtonSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="ToggleButton Slot motion demos"
      items={toggleButtonSlotMotionGallery}
    />
  );
}
