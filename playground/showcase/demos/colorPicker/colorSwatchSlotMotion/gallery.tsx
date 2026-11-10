import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { ColorSwatchMotionInstantHoverDemo } from "./ColorSwatchMotionInstantHover.demo";
import colorSwatchMotionInstantHoverSource from "./ColorSwatchMotionInstantHover.demo.tsx?raw";
import { ColorSwatchMotionPulseDemo } from "./ColorSwatchMotionPulse.demo";
import colorSwatchMotionPulseSource from "./ColorSwatchMotionPulse.demo.tsx?raw";
import { ColorSwatchMotionPressSpinDemo } from "./ColorSwatchMotionPressSpin.demo";
import colorSwatchMotionPressSpinSource from "./ColorSwatchMotionPressSpin.demo.tsx?raw";

export const colorSwatchSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "instant-hover", title: "Instant hover", Demo: ColorSwatchMotionInstantHoverDemo, source: colorSwatchMotionInstantHoverSource },
  { id: "pulse", title: "Pulse", Demo: ColorSwatchMotionPulseDemo, source: colorSwatchMotionPulseSource },
  { id: "press-spin", title: "Press spin", Demo: ColorSwatchMotionPressSpinDemo, source: colorSwatchMotionPressSpinSource },
];

export function ColorSwatchSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="ColorSwatch Slot motion demos"
      items={colorSwatchSlotMotionGallery}
    />
  );
}
