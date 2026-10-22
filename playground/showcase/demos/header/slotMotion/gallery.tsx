import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { HeaderMotionVarsDemo } from "./Vars.demo";
import varsSource from "./Vars.demo.tsx?raw";
import { HeaderMotionFactoryDemo } from "./Factory.demo";
import factorySource from "./Factory.demo.tsx?raw";

export const headerSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "vars", title: "Enter vars", Demo: HeaderMotionVarsDemo, source: varsSource },
  { id: "factory", title: "Enter factory", Demo: HeaderMotionFactoryDemo, source: factorySource },
];

export function HeaderSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Header Slot motion demos"
      align="stretch"
      items={headerSlotMotionGallery}
    />
  );
}
