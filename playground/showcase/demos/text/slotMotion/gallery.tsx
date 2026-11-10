import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { TextMotionInstantEnterDemo } from "./TextMotionInstantEnter.demo";
import textMotionInstantEnterSource from "./TextMotionInstantEnter.demo.tsx?raw";
import { TextMotionRootWaveDemo } from "./TextMotionRootWave.demo";
import textMotionRootWaveSource from "./TextMotionRootWave.demo.tsx?raw";
import { TextMotionEnterTintDemo } from "./TextMotionEnterTint.demo";
import textMotionEnterTintSource from "./TextMotionEnterTint.demo.tsx?raw";
import { TextMotionSplitWordsDemo } from "./TextMotionSplitWords.demo";
import textMotionSplitWordsSource from "./TextMotionSplitWords.demo.tsx?raw";
import { TextMotionTypewriterDemo } from "./TextMotionTypewriter.demo";
import textMotionTypewriterSource from "./TextMotionTypewriter.demo.tsx?raw";

export const textSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "instant-enter", title: "Instant enter", Demo: TextMotionInstantEnterDemo, source: textMotionInstantEnterSource },
  { id: "root-wave", title: "Root wave", Demo: TextMotionRootWaveDemo, source: textMotionRootWaveSource },
  { id: "enter-tint", title: "Enter tint", Demo: TextMotionEnterTintDemo, source: textMotionEnterTintSource },
  { id: "split-words", title: "SplitText words", Demo: TextMotionSplitWordsDemo, source: textMotionSplitWordsSource },
  { id: "typewriter", title: "TextPlugin typewriter", Demo: TextMotionTypewriterDemo, source: textMotionTypewriterSource },
];

export function TextSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Text Slot motion demos"
      items={textSlotMotionGallery}
    />
  );
}
