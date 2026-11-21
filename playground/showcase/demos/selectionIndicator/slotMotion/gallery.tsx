import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { SelectionIndicatorMotionClassNamesDemo } from "./ClassNames.demo";
import classNamesSource from "./ClassNames.demo.tsx?raw";
import { SelectionIndicatorMotionFillPartDemo } from "./FillPart.demo";
import fillPartSource from "./FillPart.demo.tsx?raw";
import { SelectionIndicatorMotionFillThenMarkDemo } from "./FillThenMark.demo";
import fillThenMarkSource from "./FillThenMark.demo.tsx?raw";
import { SelectionIndicatorMotionInstantFillDemo } from "./InstantFill.demo";
import instantFillSource from "./InstantFill.demo.tsx?raw";
import { SelectionIndicatorMotionKitCheckDemo } from "./KitCheck.demo";
import kitCheckSource from "./KitCheck.demo.tsx?raw";
import { SelectionIndicatorMotionPerPartDemo } from "./PerPart.demo";
import perPartSource from "./PerPart.demo.tsx?raw";
import { SelectionIndicatorMotionRootScaleDemo } from "./RootScale.demo";
import rootScaleSource from "./RootScale.demo.tsx?raw";
import { SelectionIndicatorMotionSpinningMarkDemo } from "./SpinningMark.demo";
import spinningMarkSource from "./SpinningMark.demo.tsx?raw";
import { SelectionIndicatorMotionStrokeDrawDemo } from "./StrokeDraw.demo";
import strokeDrawSource from "./StrokeDraw.demo.tsx?raw";

export const selectionIndicatorSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "kit-check", title: "Kit fill", Demo: SelectionIndicatorMotionKitCheckDemo, source: kitCheckSource },
  { id: "instant-fill", title: "Instant fill", Demo: SelectionIndicatorMotionInstantFillDemo, source: instantFillSource },
  { id: "root-scale", title: "Root scale", Demo: SelectionIndicatorMotionRootScaleDemo, source: rootScaleSource },
  { id: "spinning-mark", title: "Spinning mark", Demo: SelectionIndicatorMotionSpinningMarkDemo, source: spinningMarkSource },
  { id: "fill-then-mark", title: "Fill then mark", Demo: SelectionIndicatorMotionFillThenMarkDemo, source: fillThenMarkSource },
  { id: "fill-part", title: "Fill part", Demo: SelectionIndicatorMotionFillPartDemo, source: fillPartSource },
  { id: "per-part", title: "Per part", Demo: SelectionIndicatorMotionPerPartDemo, source: perPartSource },
  { id: "class-names", title: "classNames", Demo: SelectionIndicatorMotionClassNamesDemo, source: classNamesSource },
  { id: "stroke-draw", title: "Stroke draw", Demo: SelectionIndicatorMotionStrokeDrawDemo, source: strokeDrawSource },
];

export function SelectionIndicatorSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="SelectionIndicator Slot motion demos"
      items={selectionIndicatorSlotMotionGallery}
    />
  );
}
