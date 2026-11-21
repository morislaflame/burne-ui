import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { FormMotionInstantEnterDemo } from "./FormMotionInstantEnter.demo";
import formMotionInstantEnterSource from "./FormMotionInstantEnter.demo.tsx?raw";
import { FormMotionRootWaveDemo } from "./FormMotionRootWave.demo";
import formMotionRootWaveSource from "./FormMotionRootWave.demo.tsx?raw";
import { FormMotionErrorChangeDemo } from "./FormMotionErrorChange.demo";
import formMotionErrorChangeSource from "./FormMotionErrorChange.demo.tsx?raw";

export const formSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "instant-enter", title: "Instant enter", Demo: FormMotionInstantEnterDemo, source: formMotionInstantEnterSource },
  { id: "root-wave", title: "Root wave", Demo: FormMotionRootWaveDemo, source: formMotionRootWaveSource },
  { id: "error-change", title: "Error change", Demo: FormMotionErrorChangeDemo, source: formMotionErrorChangeSource },
];

export function FormSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Form Slot motion demos"
      items={formSlotMotionGallery}
    />
  );
}
