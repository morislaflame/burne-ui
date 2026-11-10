import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { StackMotionVarsDemo } from "./Vars.demo";
import varsSource from "./Vars.demo.tsx?raw";
import { StackMotionFactoryDemo } from "./Factory.demo";
import factorySource from "./Factory.demo.tsx?raw";

export const stackSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "vars", title: "Enter vars", Demo: StackMotionVarsDemo, source: varsSource },
  { id: "factory", title: "Enter factory", Demo: StackMotionFactoryDemo, source: factorySource },
];

export function StackSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Stack Slot motion demos"
      align="stretch"
      items={stackSlotMotionGallery}
    />
  );
}
