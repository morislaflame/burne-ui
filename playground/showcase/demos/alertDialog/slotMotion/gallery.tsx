import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { AlertDialogMotionInstantPanelDemo } from "./AlertDialogMotionInstantPanel.demo";
import alertDialogMotionInstantPanelSource from "./AlertDialogMotionInstantPanel.demo.tsx?raw";
import { AlertDialogMotionIndicatorPopDemo } from "./AlertDialogMotionIndicatorPop.demo";
import alertDialogMotionIndicatorPopSource from "./AlertDialogMotionIndicatorPop.demo.tsx?raw";
import { AlertDialogMotionChromeSplitDemo } from "./AlertDialogMotionChromeSplit.demo";
import alertDialogMotionChromeSplitSource from "./AlertDialogMotionChromeSplit.demo.tsx?raw";
import { AlertDialogMotionBodyStaggerDemo } from "./AlertDialogMotionBodyStagger.demo";
import alertDialogMotionBodyStaggerSource from "./AlertDialogMotionBodyStagger.demo.tsx?raw";
import { AlertDialogMotionHeadingBlockDemo } from "./AlertDialogMotionHeadingBlock.demo";
import alertDialogMotionHeadingBlockSource from "./AlertDialogMotionHeadingBlock.demo.tsx?raw";
import { AlertDialogMotionOverlayHoldDemo } from "./AlertDialogMotionOverlayHold.demo";
import alertDialogMotionOverlayHoldSource from "./AlertDialogMotionOverlayHold.demo.tsx?raw";

export const alertDialogSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "instant-panel", title: "Instant panel", Demo: AlertDialogMotionInstantPanelDemo, source: alertDialogMotionInstantPanelSource },
  { id: "indicator-pop", title: "Indicator pop", Demo: AlertDialogMotionIndicatorPopDemo, source: alertDialogMotionIndicatorPopSource },
  { id: "chrome-split", title: "Chrome split", Demo: AlertDialogMotionChromeSplitDemo, source: alertDialogMotionChromeSplitSource },
  { id: "body-stagger", title: "Body stagger", Demo: AlertDialogMotionBodyStaggerDemo, source: alertDialogMotionBodyStaggerSource },
  { id: "heading-block", title: "Heading block", Demo: AlertDialogMotionHeadingBlockDemo, source: alertDialogMotionHeadingBlockSource },
  { id: "overlay-hold", title: "Overlay hold", Demo: AlertDialogMotionOverlayHoldDemo, source: alertDialogMotionOverlayHoldSource },
];

export function AlertDialogSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="AlertDialog Slot motion demos"
      items={alertDialogSlotMotionGallery}
    />
  );
}
