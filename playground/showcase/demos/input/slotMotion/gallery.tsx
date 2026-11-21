import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { InputMotionInstantHoverDemo } from "./InputMotionInstantHover.demo";
import inputMotionInstantHoverSource from "./InputMotionInstantHover.demo.tsx?raw";
import { InputMotionAffixOrbitDemo } from "./InputMotionAffixOrbit.demo";
import inputMotionAffixOrbitSource from "./InputMotionAffixOrbit.demo.tsx?raw";
import { InputMotionFileRowExitDemo } from "./InputMotionFileRowExit.demo";
import inputMotionFileRowExitSource from "./InputMotionFileRowExit.demo.tsx?raw";
import { InputMotionPasswordRevealDemo } from "./InputMotionPasswordReveal.demo";
import inputMotionPasswordRevealSource from "./InputMotionPasswordReveal.demo.tsx?raw";
import { InputMotionHintErrorDemo } from "./InputMotionHintError.demo";
import inputMotionHintErrorSource from "./InputMotionHintError.demo.tsx?raw";

export const inputSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "instant-hover", title: "Instant hover", Demo: InputMotionInstantHoverDemo, source: inputMotionInstantHoverSource },
  { id: "affix-orbit", title: "Affix orbit", Demo: InputMotionAffixOrbitDemo, source: inputMotionAffixOrbitSource },
  { id: "file-row-exit", title: "File row exit", Demo: InputMotionFileRowExitDemo, source: inputMotionFileRowExitSource },
  { id: "password-reveal", title: "Password reveal", Demo: InputMotionPasswordRevealDemo, source: inputMotionPasswordRevealSource },
  { id: "hint-error", title: "Hint error", Demo: InputMotionHintErrorDemo, source: inputMotionHintErrorSource },
];

export function InputSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Input Slot motion demos"
      align="stretch"
      items={inputSlotMotionGallery}
    />
  );
}
