import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { ButtonGroupMotionInstantEnterDemo } from "./ButtonGroupMotionInstantEnter.demo";
import buttonGroupMotionInstantEnterSource from "./ButtonGroupMotionInstantEnter.demo.tsx?raw";
import { ButtonGroupMotionRootWaveDemo } from "./ButtonGroupMotionRootWave.demo";
import buttonGroupMotionRootWaveSource from "./ButtonGroupMotionRootWave.demo.tsx?raw";
import { ButtonGroupMotionScrambleTextDemo } from "./ButtonGroupMotionScrambleText.demo";
import buttonGroupMotionScrambleTextSource from "./ButtonGroupMotionScrambleText.demo.tsx?raw";
import { ButtonGroupMotionTextTintDemo } from "./ButtonGroupMotionTextTint.demo";
import buttonGroupMotionTextTintSource from "./ButtonGroupMotionTextTint.demo.tsx?raw";

export const buttonGroupSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "instant-enter", title: "Instant enter", Demo: ButtonGroupMotionInstantEnterDemo, source: buttonGroupMotionInstantEnterSource },
  { id: "root-wave", title: "Root wave", Demo: ButtonGroupMotionRootWaveDemo, source: buttonGroupMotionRootWaveSource },
  { id: "text-tint", title: "Text tint", Demo: ButtonGroupMotionTextTintDemo, source: buttonGroupMotionTextTintSource },
  { id: "scramble-text", title: "ScrambleText", Demo: ButtonGroupMotionScrambleTextDemo, source: buttonGroupMotionScrambleTextSource },
];

export function ButtonGroupSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="ButtonGroup Slot motion demos"
      items={buttonGroupSlotMotionGallery}
    />
  );
}
