import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { TabsMotionInstantEnterDemo } from "./TabsMotionInstantEnter.demo";
import tabsMotionInstantEnterSource from "./TabsMotionInstantEnter.demo.tsx?raw";
import { TabsMotionPanelWaveDemo } from "./TabsMotionPanelWave.demo";
import tabsMotionPanelWaveSource from "./TabsMotionPanelWave.demo.tsx?raw";
import { TabsMotionSelectionTintDemo } from "./TabsMotionSelectionTint.demo";
import tabsMotionSelectionTintSource from "./TabsMotionSelectionTint.demo.tsx?raw";

export const tabsSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "instant-enter", title: "Instant enter", Demo: TabsMotionInstantEnterDemo, source: tabsMotionInstantEnterSource },
  { id: "panel-wave", title: "Panel wave", Demo: TabsMotionPanelWaveDemo, source: tabsMotionPanelWaveSource },
  { id: "selection-tint", title: "Selection tint", Demo: TabsMotionSelectionTintDemo, source: tabsMotionSelectionTintSource },
];

export function TabsSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Tabs Slot motion demos"
      align="stretch"
      items={tabsSlotMotionGallery}
    />
  );
}
