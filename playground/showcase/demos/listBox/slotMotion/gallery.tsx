import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { ListBoxMotionInstantPressDemo } from "./ListBoxMotionInstantPress.demo";
import listBoxMotionInstantPressSource from "./ListBoxMotionInstantPress.demo.tsx?raw";
import { ListBoxMotionItemWaveDemo } from "./ListBoxMotionItemWave.demo";
import listBoxMotionItemWaveSource from "./ListBoxMotionItemWave.demo.tsx?raw";
import { ListBoxMotionLabelTintDemo } from "./ListBoxMotionLabelTint.demo";
import listBoxMotionLabelTintSource from "./ListBoxMotionLabelTint.demo.tsx?raw";
import { ListBoxMotionHintStaggerDemo } from "./ListBoxMotionHintStagger.demo";
import listBoxMotionHintStaggerSource from "./ListBoxMotionHintStagger.demo.tsx?raw";
import { ListBoxMotionSectionHeaderDemo } from "./ListBoxMotionSectionHeader.demo";
import listBoxMotionSectionHeaderSource from "./ListBoxMotionSectionHeader.demo.tsx?raw";
import { ListBoxMotionSeparatorDemo } from "./ListBoxMotionSeparator.demo";
import listBoxMotionSeparatorSource from "./ListBoxMotionSeparator.demo.tsx?raw";

export const listBoxSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "instant-press", title: "Instant press", Demo: ListBoxMotionInstantPressDemo, source: listBoxMotionInstantPressSource },
  { id: "item-wave", title: "Item wave", Demo: ListBoxMotionItemWaveDemo, source: listBoxMotionItemWaveSource },
  { id: "label-tint", title: "Label tint", Demo: ListBoxMotionLabelTintDemo, source: listBoxMotionLabelTintSource },
  { id: "hint-stagger", title: "Hint stagger", Demo: ListBoxMotionHintStaggerDemo, source: listBoxMotionHintStaggerSource },
  { id: "section-header", title: "Section header", Demo: ListBoxMotionSectionHeaderDemo, source: listBoxMotionSectionHeaderSource },
  { id: "separator", title: "Separator", Demo: ListBoxMotionSeparatorDemo, source: listBoxMotionSeparatorSource },
];

export function ListBoxSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="ListBox Slot motion demos"
      align="stretch"
      items={listBoxSlotMotionGallery}
    />
  );
}
