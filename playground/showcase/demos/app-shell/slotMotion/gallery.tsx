import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { AppShellMotionVarsDemo } from "./Vars.demo";
import varsSource from "./Vars.demo.tsx?raw";
import { AppShellMotionFactoryDemo } from "./Factory.demo";
import factorySource from "./Factory.demo.tsx?raw";

export const appshellSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "vars", title: "Enter vars", Demo: AppShellMotionVarsDemo, source: varsSource },
  { id: "factory", title: "Enter factory", Demo: AppShellMotionFactoryDemo, source: factorySource },
];

export function AppShellSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="AppShell Slot motion demos"
      align="stretch"
      items={appshellSlotMotionGallery}
    />
  );
}
