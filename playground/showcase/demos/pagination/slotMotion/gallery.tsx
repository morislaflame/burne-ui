import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { PaginationMotionInstantPressDemo } from "./PaginationMotionInstantPress.demo";
import paginationMotionInstantPressSource from "./PaginationMotionInstantPress.demo.tsx?raw";
import { PaginationMotionControlWaveDemo } from "./PaginationMotionControlWave.demo";
import paginationMotionControlWaveSource from "./PaginationMotionControlWave.demo.tsx?raw";
import { PaginationMotionEllipsisDemo } from "./PaginationMotionEllipsis.demo";
import paginationMotionEllipsisSource from "./PaginationMotionEllipsis.demo.tsx?raw";
import { PaginationMotionNavTintDemo } from "./PaginationMotionNavTint.demo";
import paginationMotionNavTintSource from "./PaginationMotionNavTint.demo.tsx?raw";

export const paginationSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "instant-press", title: "Instant press", Demo: PaginationMotionInstantPressDemo, source: paginationMotionInstantPressSource },
  { id: "control-wave", title: "Control wave", Demo: PaginationMotionControlWaveDemo, source: paginationMotionControlWaveSource },
  { id: "ellipsis", title: "Ellipsis", Demo: PaginationMotionEllipsisDemo, source: paginationMotionEllipsisSource },
  { id: "nav-tint", title: "Nav tint", Demo: PaginationMotionNavTintDemo, source: paginationMotionNavTintSource },
];

export function PaginationSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Pagination Slot motion demos"
      align="stretch"
      items={paginationSlotMotionGallery}
    />
  );
}
