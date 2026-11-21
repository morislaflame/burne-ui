import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { KbdMotionInstantHoverDemo } from "./KbdMotionInstantHover.demo";
import kbdMotionInstantHoverSource from "./KbdMotionInstantHover.demo.tsx?raw";
import { KbdMotionRootTiltDemo } from "./KbdMotionRootTilt.demo";
import kbdMotionRootTiltSource from "./KbdMotionRootTilt.demo.tsx?raw";
import { KbdMotionTextPopDemo } from "./KbdMotionTextPop.demo";
import kbdMotionTextPopSource from "./KbdMotionTextPop.demo.tsx?raw";
import { KbdMotionKeyBounceDemo } from "./KbdMotionKeyBounce.demo";
import kbdMotionKeyBounceSource from "./KbdMotionKeyBounce.demo.tsx?raw";
import { KbdMotionGroupDemo } from "./KbdMotionGroup.demo";
import kbdMotionGroupSource from "./KbdMotionGroup.demo.tsx?raw";

export const kbdSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "instant-hover", title: "Instant hover", Demo: KbdMotionInstantHoverDemo, source: kbdMotionInstantHoverSource },
  { id: "root-tilt", title: "Root tilt", Demo: KbdMotionRootTiltDemo, source: kbdMotionRootTiltSource },
  { id: "text-pop", title: "Text pop", Demo: KbdMotionTextPopDemo, source: kbdMotionTextPopSource },
  { id: "key-bounce", title: "Key bounce", Demo: KbdMotionKeyBounceDemo, source: kbdMotionKeyBounceSource },
  { id: "group", title: "Group", Demo: KbdMotionGroupDemo, source: kbdMotionGroupSource },
];

export function KbdSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Kbd Slot motion demos"
      items={kbdSlotMotionGallery}
    />
  );
}
