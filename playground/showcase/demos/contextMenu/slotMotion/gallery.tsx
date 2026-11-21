import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { ContextMenuMotionInstantLeaveDemo } from "./InstantLeave.demo";
import instantLeaveSource from "./InstantLeave.demo.tsx?raw";
import { ContextMenuMotionBodyStaggerDemo } from "./BodyStagger.demo";
import bodyStaggerSource from "./BodyStagger.demo.tsx?raw";
import { ContextMenuMotionLabelDemo } from "./Label.demo";
import labelSource from "./Label.demo.tsx?raw";
import { ContextMenuMotionSeparatorDemo } from "./Separator.demo";
import separatorSource from "./Separator.demo.tsx?raw";
import { ContextMenuMotionSubSlideDemo } from "./SubSlideX.demo";
import subSlideSource from "./SubSlideX.demo.tsx?raw";
import { ContextMenuMotionOriginScaleDemo } from "./OriginScale.demo";
import originScaleSource from "./OriginScale.demo.tsx?raw";

export const contextMenuSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "instant-leave", title: "Instant leave", Demo: ContextMenuMotionInstantLeaveDemo, source: instantLeaveSource },
  { id: "body-stagger", title: "Body stagger", Demo: ContextMenuMotionBodyStaggerDemo, source: bodyStaggerSource },
  { id: "label", title: "Label", Demo: ContextMenuMotionLabelDemo, source: labelSource },
  { id: "separator", title: "Separator", Demo: ContextMenuMotionSeparatorDemo, source: separatorSource },
  { id: "sub-slide-x", title: "Sub slide X", Demo: ContextMenuMotionSubSlideDemo, source: subSlideSource },
  { id: "origin-scale", title: "From the pointer", Demo: ContextMenuMotionOriginScaleDemo, source: originScaleSource },
];

export function ContextMenuSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="ContextMenu Slot motion demos"
      items={contextMenuSlotMotionGallery}
    />
  );
}
