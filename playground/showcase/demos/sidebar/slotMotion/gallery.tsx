import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { SidebarMotionVarsDemo } from "./Vars.demo";
import varsSource from "./Vars.demo.tsx?raw";
import { SidebarMotionFactoryDemo } from "./Factory.demo";
import factorySource from "./Factory.demo.tsx?raw";

export const sidebarSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "vars", title: "Enter vars", Demo: SidebarMotionVarsDemo, source: varsSource },
  { id: "factory", title: "Enter factory", Demo: SidebarMotionFactoryDemo, source: factorySource },
];

export function SidebarSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Sidebar Slot motion demos"
      align="stretch"
      items={sidebarSlotMotionGallery}
    />
  );
}
