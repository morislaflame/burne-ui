import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { BreadcrumbsMotionInstantPressDemo } from "./BreadcrumbsMotionInstantPress.demo";
import breadcrumbsMotionInstantPressSource from "./BreadcrumbsMotionInstantPress.demo.tsx?raw";
import { BreadcrumbsMotionCrumbWaveDemo } from "./BreadcrumbsMotionCrumbWave.demo";
import breadcrumbsMotionCrumbWaveSource from "./BreadcrumbsMotionCrumbWave.demo.tsx?raw";
import { BreadcrumbsMotionTextTintDemo } from "./BreadcrumbsMotionTextTint.demo";
import breadcrumbsMotionTextTintSource from "./BreadcrumbsMotionTextTint.demo.tsx?raw";
import { BreadcrumbsMotionListSeparatorDemo } from "./BreadcrumbsMotionListSeparator.demo";
import breadcrumbsMotionListSeparatorSource from "./BreadcrumbsMotionListSeparator.demo.tsx?raw";

export const breadcrumbsSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "instant-press", title: "Instant press", Demo: BreadcrumbsMotionInstantPressDemo, source: breadcrumbsMotionInstantPressSource },
  { id: "crumb-wave", title: "Crumb wave", Demo: BreadcrumbsMotionCrumbWaveDemo, source: breadcrumbsMotionCrumbWaveSource },
  { id: "text-tint", title: "Text tint", Demo: BreadcrumbsMotionTextTintDemo, source: breadcrumbsMotionTextTintSource },
  { id: "list-separator", title: "List separator", Demo: BreadcrumbsMotionListSeparatorDemo, source: breadcrumbsMotionListSeparatorSource },
];

export function BreadcrumbsSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Breadcrumbs Slot motion demos"
      align="stretch"
      items={breadcrumbsSlotMotionGallery}
    />
  );
}
