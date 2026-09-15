import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { BadgeMotionInstantHoverDemo } from "./BadgeMotionInstantHover.demo";
import badgeMotionInstantHoverSource from "./BadgeMotionInstantHover.demo.tsx?raw";
import { BadgeMotionRootTiltDemo } from "./BadgeMotionRootTilt.demo";
import badgeMotionRootTiltSource from "./BadgeMotionRootTilt.demo.tsx?raw";
import { BadgeMotionAnchorPopDemo } from "./BadgeMotionAnchorPop.demo";
import badgeMotionAnchorPopSource from "./BadgeMotionAnchorPop.demo.tsx?raw";
import { BadgeMotionDotPulseDemo } from "./BadgeMotionDotPulse.demo";
import badgeMotionDotPulseSource from "./BadgeMotionDotPulse.demo.tsx?raw";

export const badgeSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "instant-hover", title: "Instant hover", Demo: BadgeMotionInstantHoverDemo, source: badgeMotionInstantHoverSource },
  { id: "root-tilt", title: "Root tilt", Demo: BadgeMotionRootTiltDemo, source: badgeMotionRootTiltSource },
  { id: "anchor-pop", title: "Anchor pop", Demo: BadgeMotionAnchorPopDemo, source: badgeMotionAnchorPopSource },
  { id: "dot-pulse", title: "Dot pulse", Demo: BadgeMotionDotPulseDemo, source: badgeMotionDotPulseSource },
];

export function BadgeSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Badge Slot motion demos"
      items={badgeSlotMotionGallery}
    />
  );
}
