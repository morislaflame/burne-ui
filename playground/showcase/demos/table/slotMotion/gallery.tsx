import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { TableMotionInstantEnterDemo } from "./TableMotionInstantEnter.demo";
import tableMotionInstantEnterSource from "./TableMotionInstantEnter.demo.tsx?raw";
import { TableMotionRootWaveDemo } from "./TableMotionRootWave.demo";
import tableMotionRootWaveSource from "./TableMotionRootWave.demo.tsx?raw";
import { TableMotionRowCheckDemo } from "./TableMotionRowCheck.demo";
import tableMotionRowCheckSource from "./TableMotionRowCheck.demo.tsx?raw";
import { TableMotionColumnLabelDemo } from "./TableMotionColumnLabel.demo";
import tableMotionColumnLabelSource from "./TableMotionColumnLabel.demo.tsx?raw";
import { TableMotionHeaderBodyDemo } from "./TableMotionHeaderBody.demo";
import tableMotionHeaderBodySource from "./TableMotionHeaderBody.demo.tsx?raw";
import { TableMotionEmptyDemo } from "./TableMotionEmpty.demo";
import tableMotionEmptySource from "./TableMotionEmpty.demo.tsx?raw";

export const tableSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "instant-enter", title: "Instant enter", Demo: TableMotionInstantEnterDemo, source: tableMotionInstantEnterSource },
  { id: "root-wave", title: "Root wave", Demo: TableMotionRootWaveDemo, source: tableMotionRootWaveSource },
  { id: "row-check", title: "Row check", Demo: TableMotionRowCheckDemo, source: tableMotionRowCheckSource },
  { id: "column-label", title: "Column label", Demo: TableMotionColumnLabelDemo, source: tableMotionColumnLabelSource },
  { id: "header-body", title: "Header body", Demo: TableMotionHeaderBodyDemo, source: tableMotionHeaderBodySource },
  { id: "empty", title: "Empty", Demo: TableMotionEmptyDemo, source: tableMotionEmptySource },
];

export function TableSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Table Slot motion demos"
      align="stretch"
      items={tableSlotMotionGallery}
    />
  );
}
