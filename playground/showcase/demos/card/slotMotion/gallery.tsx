import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { CardMotionInstantHoverDemo } from "./CardMotionInstantHover.demo";
import cardMotionInstantHoverSource from "./CardMotionInstantHover.demo.tsx?raw";
import { CardMotionPressBounceDemo } from "./CardMotionPressBounce.demo";
import cardMotionPressBounceSource from "./CardMotionPressBounce.demo.tsx?raw";
import { CardMotionTitlePopDemo } from "./CardMotionTitlePop.demo";
import cardMotionTitlePopSource from "./CardMotionTitlePop.demo.tsx?raw";
import { CardMotionChromeSplitDemo } from "./CardMotionChromeSplit.demo";
import cardMotionChromeSplitSource from "./CardMotionChromeSplit.demo.tsx?raw";
import { CardMotionMouseFollowDemo } from "./CardMotionMouseFollow.demo";
import cardMotionMouseFollowSource from "./CardMotionMouseFollow.demo.tsx?raw";

export const cardSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "instant-hover", title: "Instant hover", Demo: CardMotionInstantHoverDemo, source: cardMotionInstantHoverSource },
  { id: "press-bounce", title: "Press bounce", Demo: CardMotionPressBounceDemo, source: cardMotionPressBounceSource },
  { id: "title-pop", title: "Title pop", Demo: CardMotionTitlePopDemo, source: cardMotionTitlePopSource },
  { id: "chrome-split", title: "Chrome split", Demo: CardMotionChromeSplitDemo, source: cardMotionChromeSplitSource },
  { id: "mouse-follow", title: "Mouse follow", Demo: CardMotionMouseFollowDemo, source: cardMotionMouseFollowSource },
];

export function CardSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Card Slot motion demos"
      align="stretch"
      items={cardSlotMotionGallery}
    />
  );
}
