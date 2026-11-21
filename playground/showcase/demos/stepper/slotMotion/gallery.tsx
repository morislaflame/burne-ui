import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { StepperMotionAppearDemo } from "./Appear.demo";
import appearSource from "./Appear.demo.tsx?raw";
import { StepperMotionNudgeDemo } from "./Nudge.demo";
import nudgeSource from "./Nudge.demo.tsx?raw";

export const stepperSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "nudge", title: "Indicator nudge", Demo: StepperMotionNudgeDemo, source: nudgeSource },
  { id: "appear", title: "Appear in order", Demo: StepperMotionAppearDemo, source: appearSource },
];

export function StepperSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Stepper Slot motion demos"
      align="stretch"
      items={stepperSlotMotionGallery}
    />
  );
}
