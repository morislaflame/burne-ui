import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { DropdownMotionTriggerPressDemo } from "./DropdownMotionTriggerPress.demo";
import dropdownMotionTriggerPressSource from "./DropdownMotionTriggerPress.demo.tsx?raw";
import { DropdownMotionInstantLeaveDemo } from "./DropdownMotionInstantLeave.demo";
import dropdownMotionInstantLeaveSource from "./DropdownMotionInstantLeave.demo.tsx?raw";
import { DropdownMotionBodyStaggerDemo } from "./DropdownMotionBodyStagger.demo";
import dropdownMotionBodyStaggerSource from "./DropdownMotionBodyStagger.demo.tsx?raw";
import { DropdownMotionLabelDemo } from "./DropdownMotionLabel.demo";
import dropdownMotionLabelSource from "./DropdownMotionLabel.demo.tsx?raw";
import { DropdownMotionSeparatorDemo } from "./DropdownMotionSeparator.demo";
import dropdownMotionSeparatorSource from "./DropdownMotionSeparator.demo.tsx?raw";
import { DropdownMotionSubSlideXDemo } from "./DropdownMotionSubSlideX.demo";
import dropdownMotionSubSlideXSource from "./DropdownMotionSubSlideX.demo.tsx?raw";
import { DropdownMotionOriginScaleDemo } from "./DropdownMotionOriginScale.demo";
import dropdownMotionOriginScaleSource from "./DropdownMotionOriginScale.demo.tsx?raw";

export const dropdownSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "trigger-press", title: "Trigger press", Demo: DropdownMotionTriggerPressDemo, source: dropdownMotionTriggerPressSource },
  { id: "instant-leave", title: "Instant leave", Demo: DropdownMotionInstantLeaveDemo, source: dropdownMotionInstantLeaveSource },
  { id: "body-stagger", title: "Body stagger", Demo: DropdownMotionBodyStaggerDemo, source: dropdownMotionBodyStaggerSource },
  { id: "label", title: "Label", Demo: DropdownMotionLabelDemo, source: dropdownMotionLabelSource },
  { id: "separator", title: "Separator", Demo: DropdownMotionSeparatorDemo, source: dropdownMotionSeparatorSource },
  { id: "sub-slide-x", title: "Sub slide X", Demo: DropdownMotionSubSlideXDemo, source: dropdownMotionSubSlideXSource },
  { id: "origin-scale", title: "Origin scale", Demo: DropdownMotionOriginScaleDemo, source: dropdownMotionOriginScaleSource },
];

export function DropdownSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Dropdown Slot motion demos"
      items={dropdownSlotMotionGallery}
    />
  );
}
