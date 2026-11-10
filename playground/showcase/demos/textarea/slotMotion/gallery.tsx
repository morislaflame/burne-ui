import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { TextAreaMotionInstantHoverDemo } from "./TextAreaMotionInstantHover.demo";
import textAreaMotionInstantHoverSource from "./TextAreaMotionInstantHover.demo.tsx?raw";
import { TextAreaMotionShellWaveDemo } from "./TextAreaMotionShellWave.demo";
import textAreaMotionShellWaveSource from "./TextAreaMotionShellWave.demo.tsx?raw";
import { TextAreaMotionResizePulseDemo } from "./TextAreaMotionResizePulse.demo";
import textAreaMotionResizePulseSource from "./TextAreaMotionResizePulse.demo.tsx?raw";
import { TextAreaMotionControlTintDemo } from "./TextAreaMotionControlTint.demo";
import textAreaMotionControlTintSource from "./TextAreaMotionControlTint.demo.tsx?raw";
import { TextAreaMotionHintEnterDemo } from "./TextAreaMotionHintEnter.demo";
import textAreaMotionHintEnterSource from "./TextAreaMotionHintEnter.demo.tsx?raw";

export const textAreaSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "instant-hover", title: "Instant hover", Demo: TextAreaMotionInstantHoverDemo, source: textAreaMotionInstantHoverSource },
  { id: "shell-wave", title: "Shell wave", Demo: TextAreaMotionShellWaveDemo, source: textAreaMotionShellWaveSource },
  { id: "resize-pulse", title: "Resize pulse", Demo: TextAreaMotionResizePulseDemo, source: textAreaMotionResizePulseSource },
  { id: "control-tint", title: "Control tint", Demo: TextAreaMotionControlTintDemo, source: textAreaMotionControlTintSource },
  { id: "hint-enter", title: "Hint enter", Demo: TextAreaMotionHintEnterDemo, source: textAreaMotionHintEnterSource },
];

export function TextAreaSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="TextArea Slot motion demos"
      align="stretch"
      items={textAreaSlotMotionGallery}
    />
  );
}
