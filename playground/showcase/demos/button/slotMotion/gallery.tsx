import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { ButtonMotionDefaultDemo } from "./ButtonMotionDefault.demo";
import buttonMotionDefaultSource from "./ButtonMotionDefault.demo.tsx?raw";
import { ButtonMotionNoPressDemo } from "./ButtonMotionNoPress.demo";
import buttonMotionNoPressSource from "./ButtonMotionNoPress.demo.tsx?raw";
import { ButtonMotionHoverYDemo } from "./ButtonMotionHoverY.demo";
import buttonMotionHoverYSource from "./ButtonMotionHoverY.demo.tsx?raw";
import { ButtonMotionWiggleDemo } from "./ButtonMotionWiggle.demo";
import buttonMotionWiggleSource from "./ButtonMotionWiggle.demo.tsx?raw";
import { ButtonMotionIconColorDemo } from "./ButtonMotionIconColor.demo";
import buttonMotionIconColorSource from "./ButtonMotionIconColor.demo.tsx?raw";
import { ButtonMotionCompoundPartsDemo } from "./ButtonMotionCompoundParts.demo";
import buttonMotionCompoundPartsSource from "./ButtonMotionCompoundParts.demo.tsx?raw";
import { ButtonMotionMagnetDemo } from "./ButtonMotionMagnet.demo";
import buttonMotionMagnetSource from "./ButtonMotionMagnet.demo.tsx?raw";

export const buttonSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "default", title: "Default", Demo: ButtonMotionDefaultDemo, source: buttonMotionDefaultSource },
  { id: "no-press", title: "No press", Demo: ButtonMotionNoPressDemo, source: buttonMotionNoPressSource },
  { id: "hover-y", title: "Hover Y", Demo: ButtonMotionHoverYDemo, source: buttonMotionHoverYSource },
  { id: "wiggle", title: "Wiggle", Demo: ButtonMotionWiggleDemo, source: buttonMotionWiggleSource },
  { id: "icon-color", title: "Icon color", Demo: ButtonMotionIconColorDemo, source: buttonMotionIconColorSource },
  { id: "compound-parts", title: "Compound parts", Demo: ButtonMotionCompoundPartsDemo, source: buttonMotionCompoundPartsSource },
  { id: "magnet", title: "Magnet", Demo: ButtonMotionMagnetDemo, source: buttonMotionMagnetSource },
];

export function ButtonSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Button Slot motion demos"
      items={buttonSlotMotionGallery}
    />
  );
}
