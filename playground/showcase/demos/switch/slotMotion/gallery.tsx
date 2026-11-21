import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { SwitchMotionDefaultDemo } from "./SwitchMotionDefault.demo";
import switchMotionDefaultSource from "./SwitchMotionDefault.demo.tsx?raw";
import { SwitchMotionInstantThumbDemo } from "./SwitchMotionInstantThumb.demo";
import switchMotionInstantThumbSource from "./SwitchMotionInstantThumb.demo.tsx?raw";
import { SwitchMotionBounceThumbDemo } from "./SwitchMotionBounceThumb.demo";
import switchMotionBounceThumbSource from "./SwitchMotionBounceThumb.demo.tsx?raw";
import { SwitchMotionFillFadeDemo } from "./SwitchMotionFillFade.demo";
import switchMotionFillFadeSource from "./SwitchMotionFillFade.demo.tsx?raw";
import { SwitchMotionIconsDemo } from "./SwitchMotionIcons.demo";
import switchMotionIconsSource from "./SwitchMotionIcons.demo.tsx?raw";
import { SwitchMotionLabelColorDemo } from "./SwitchMotionLabelColor.demo";
import switchMotionLabelColorSource from "./SwitchMotionLabelColor.demo.tsx?raw";
import { SwitchMotionTrackDemo } from "./SwitchMotionTrack.demo";
import switchMotionTrackSource from "./SwitchMotionTrack.demo.tsx?raw";

export const switchSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "default", title: "Default", Demo: SwitchMotionDefaultDemo, source: switchMotionDefaultSource },
  { id: "instant-thumb", title: "Instant thumb", Demo: SwitchMotionInstantThumbDemo, source: switchMotionInstantThumbSource },
  { id: "bounce-thumb", title: "Bounce thumb", Demo: SwitchMotionBounceThumbDemo, source: switchMotionBounceThumbSource },
  { id: "fill-fade", title: "Fill fade", Demo: SwitchMotionFillFadeDemo, source: switchMotionFillFadeSource },
  { id: "icons", title: "Icons", Demo: SwitchMotionIconsDemo, source: switchMotionIconsSource },
  { id: "label-color", title: "Label color", Demo: SwitchMotionLabelColorDemo, source: switchMotionLabelColorSource },
  { id: "track", title: "Track", Demo: SwitchMotionTrackDemo, source: switchMotionTrackSource },
];

export function SwitchSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Switch Slot motion demos"
      align="stretch"
      items={switchSlotMotionGallery}
    />
  );
}
