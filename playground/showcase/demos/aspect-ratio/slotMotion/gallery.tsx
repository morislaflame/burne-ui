import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { AspectRatioMotionVarsDemo } from "./Vars.demo";
import varsSource from "./Vars.demo.tsx?raw";
import { AspectRatioMotionFactoryDemo } from "./Factory.demo";
import factorySource from "./Factory.demo.tsx?raw";

export const aspectratioSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "vars", title: "Enter vars", Demo: AspectRatioMotionVarsDemo, source: varsSource },
  { id: "factory", title: "Enter factory", Demo: AspectRatioMotionFactoryDemo, source: factorySource },
];

export function AspectRatioSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="AspectRatio Slot motion demos"
      align="stretch"
      items={aspectratioSlotMotionGallery}
    />
  );
}
