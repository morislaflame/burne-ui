import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { DrawerMotionDefaultDemo } from "./DrawerMotionDefault.demo";
import drawerMotionDefaultSource from "./DrawerMotionDefault.demo.tsx?raw";
import { DrawerMotionInstantPanelDemo } from "./DrawerMotionInstantPanel.demo";
import drawerMotionInstantPanelSource from "./DrawerMotionInstantPanel.demo.tsx?raw";
import { DrawerMotionTitleStaggerDemo } from "./DrawerMotionTitleStagger.demo";
import drawerMotionTitleStaggerSource from "./DrawerMotionTitleStagger.demo.tsx?raw";
import { DrawerMotionBodyStaggerDemo } from "./DrawerMotionBodyStagger.demo";
import drawerMotionBodyStaggerSource from "./DrawerMotionBodyStagger.demo.tsx?raw";
import { DrawerMotionHeadingBlockDemo } from "./DrawerMotionHeadingBlock.demo";
import drawerMotionHeadingBlockSource from "./DrawerMotionHeadingBlock.demo.tsx?raw";
import { DrawerMotionBounceSlideDemo } from "./DrawerMotionBounceSlide.demo";
import drawerMotionBounceSlideSource from "./DrawerMotionBounceSlide.demo.tsx?raw";

export const drawerSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "default", title: "Default", Demo: DrawerMotionDefaultDemo, source: drawerMotionDefaultSource },
  { id: "instant-panel", title: "Instant panel", Demo: DrawerMotionInstantPanelDemo, source: drawerMotionInstantPanelSource },
  { id: "title-stagger", title: "Title stagger", Demo: DrawerMotionTitleStaggerDemo, source: drawerMotionTitleStaggerSource },
  { id: "body-stagger", title: "Body stagger", Demo: DrawerMotionBodyStaggerDemo, source: drawerMotionBodyStaggerSource },
  { id: "heading-block", title: "Heading block", Demo: DrawerMotionHeadingBlockDemo, source: drawerMotionHeadingBlockSource },
  { id: "bounce-slide", title: "Bounce slide", Demo: DrawerMotionBounceSlideDemo, source: drawerMotionBounceSlideSource },
];

export function DrawerSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Drawer Slot motion demos"
      items={drawerSlotMotionGallery}
    />
  );
}
