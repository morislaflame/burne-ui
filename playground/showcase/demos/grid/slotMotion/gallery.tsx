import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { GridMotionVarsDemo } from "./Vars.demo";
import varsSource from "./Vars.demo.tsx?raw";
import { GridMotionFactoryDemo } from "./Factory.demo";
import factorySource from "./Factory.demo.tsx?raw";

export const gridSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "vars", title: "Enter vars", Demo: GridMotionVarsDemo, source: varsSource },
  { id: "factory", title: "Enter factory", Demo: GridMotionFactoryDemo, source: factorySource },
];

export function GridSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Grid Slot motion demos"
      align="stretch"
      items={gridSlotMotionGallery}
    />
  );
}
