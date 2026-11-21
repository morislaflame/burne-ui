import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { CheckboxMotionCornerFillDemo } from "./CheckboxMotionCornerFill.demo";
import checkboxMotionCornerFillSource from "./CheckboxMotionCornerFill.demo.tsx?raw";
import { CheckboxMotionCornerFillCompoundDemo } from "./CheckboxMotionCornerFillCompound.demo";
import checkboxMotionCornerFillCompoundSource from "./CheckboxMotionCornerFillCompound.demo.tsx?raw";
import { CheckboxMotionSpinningMarkDemo } from "./CheckboxMotionSpinningMark.demo";
import checkboxMotionSpinningMarkSource from "./CheckboxMotionSpinningMark.demo.tsx?raw";
import { CheckboxMotionLabelColorDemo } from "./CheckboxMotionLabelColor.demo";
import checkboxMotionLabelColorSource from "./CheckboxMotionLabelColor.demo.tsx?raw";
import { CheckboxMotionFillMarkStaggerDemo } from "./CheckboxMotionFillMarkStagger.demo";
import checkboxMotionFillMarkStaggerSource from "./CheckboxMotionFillMarkStagger.demo.tsx?raw";

export const checkboxSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "corner-fill", title: "Corner fill", Demo: CheckboxMotionCornerFillDemo, source: checkboxMotionCornerFillSource },
  { id: "corner-fill-compound", title: "Corner fill compound", Demo: CheckboxMotionCornerFillCompoundDemo, source: checkboxMotionCornerFillCompoundSource },
  { id: "spinning-mark", title: "Spinning mark", Demo: CheckboxMotionSpinningMarkDemo, source: checkboxMotionSpinningMarkSource },
  { id: "label-color", title: "Label color", Demo: CheckboxMotionLabelColorDemo, source: checkboxMotionLabelColorSource },
  { id: "fill-mark-stagger", title: "Fill mark stagger", Demo: CheckboxMotionFillMarkStaggerDemo, source: checkboxMotionFillMarkStaggerSource },
];

export function CheckboxSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Checkbox Slot motion demos"
      align="stretch"
      items={checkboxSlotMotionGallery}
    />
  );
}
