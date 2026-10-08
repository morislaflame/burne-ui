import { ShowcaseDemoGallery } from "../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../layout/ShowcaseDemoGallery";

import { DirectionCornerDemo } from "./Corner.demo";
import cornerSource from "./Corner.demo.tsx?raw";
import { DirectionFieldDemo } from "./Field.demo";
import fieldSource from "./Field.demo.tsx?raw";
import { DirectionFillDemo } from "./Fill.demo";
import fillSource from "./Fill.demo.tsx?raw";
import { DirectionGroupDemo } from "./Group.demo";
import groupSource from "./Group.demo.tsx?raw";

export const directionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "group", title: "Text and group", Demo: DirectionGroupDemo, source: groupSource },
  { id: "field", title: "Prefix and suffix", Demo: DirectionFieldDemo, source: fieldSource },
  { id: "fill", title: "Fill and switch", Demo: DirectionFillDemo, source: fillSource },
  { id: "corner", title: "Named corner", Demo: DirectionCornerDemo, source: cornerSource },
];

export function DirectionGalleryDemo() {
  return <ShowcaseDemoGallery aria-label="Direction demos" items={directionGallery} />;
}
