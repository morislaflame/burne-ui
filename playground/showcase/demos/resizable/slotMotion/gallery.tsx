import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { ResizableMotionVarsDemo } from "./Vars.demo";
import varsSource from "./Vars.demo.tsx?raw";
import { ResizableMotionFactoryDemo } from "./Factory.demo";
import factorySource from "./Factory.demo.tsx?raw";

export const resizableSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "vars", title: "Enter vars", Demo: ResizableMotionVarsDemo, source: varsSource },
  { id: "factory", title: "Enter factory", Demo: ResizableMotionFactoryDemo, source: factorySource },
];

export function ResizableSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Resizable Slot motion demos"
      align="stretch"
      items={resizableSlotMotionGallery}
    />
  );
}
