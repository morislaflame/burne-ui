import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { NumberInputMotionChromeDemo } from "./Chrome.demo";
import chromeSource from "./Chrome.demo.tsx?raw";
import { NumberInputMotionCompoundDemo } from "./Compound.demo";
import compoundSource from "./Compound.demo.tsx?raw";
import { NumberInputMotionHoverOffDemo } from "./HoverOff.demo";
import hoverOffSource from "./HoverOff.demo.tsx?raw";
import { NumberInputMotionNoPressDemo } from "./NoPress.demo";
import noPressSource from "./NoPress.demo.tsx?raw";
import { NumberInputMotionNudgeDemo } from "./Nudge.demo";
import nudgeSource from "./Nudge.demo.tsx?raw";
import { NumberInputMotionPartsDemo } from "./Parts.demo";
import partsSource from "./Parts.demo.tsx?raw";
import { NumberInputMotionWaveDemo } from "./Wave.demo";
import waveSource from "./Wave.demo.tsx?raw";

export const numberInputSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "hover-off", title: "Hover off", Demo: NumberInputMotionHoverOffDemo, source: hoverOffSource },
  { id: "no-press", title: "No press", Demo: NumberInputMotionNoPressDemo, source: noPressSource },
  { id: "nudge", title: "Stepper nudge", Demo: NumberInputMotionNudgeDemo, source: nudgeSource },
  { id: "parts", title: "Value and steppers", Demo: NumberInputMotionPartsDemo, source: partsSource },
  { id: "chrome", title: "Label hint error", Demo: NumberInputMotionChromeDemo, source: chromeSource },
  { id: "wave", title: "Field wave", Demo: NumberInputMotionWaveDemo, source: waveSource },
  { id: "compound", title: "Compound parts", Demo: NumberInputMotionCompoundDemo, source: compoundSource },
];

export function NumberInputSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="NumberInput Slot motion demos"
      align="start"
      items={numberInputSlotMotionGallery}
    />
  );
}
