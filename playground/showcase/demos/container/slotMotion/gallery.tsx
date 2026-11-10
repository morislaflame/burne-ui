import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { ContainerMotionVarsDemo } from "./Vars.demo";
import varsSource from "./Vars.demo.tsx?raw";
import { ContainerMotionFactoryDemo } from "./Factory.demo";
import factorySource from "./Factory.demo.tsx?raw";

export const containerSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "vars", title: "Enter vars", Demo: ContainerMotionVarsDemo, source: varsSource },
  { id: "factory", title: "Enter factory", Demo: ContainerMotionFactoryDemo, source: factorySource },
];

export function ContainerSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Container Slot motion demos"
      align="stretch"
      items={containerSlotMotionGallery}
    />
  );
}
