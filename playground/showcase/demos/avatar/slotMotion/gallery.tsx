import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { AvatarMotionInstantFadeDemo } from "./AvatarMotionInstantFade.demo";
import avatarMotionInstantFadeSource from "./AvatarMotionInstantFade.demo.tsx?raw";
import { AvatarMotionImageScaleDemo } from "./AvatarMotionImageScale.demo";
import avatarMotionImageScaleSource from "./AvatarMotionImageScale.demo.tsx?raw";
import { AvatarMotionInstantGroupDemo } from "./AvatarMotionInstantGroup.demo";
import avatarMotionInstantGroupSource from "./AvatarMotionInstantGroup.demo.tsx?raw";
import { AvatarMotionGroupRotateDemo } from "./AvatarMotionGroupRotate.demo";
import avatarMotionGroupRotateSource from "./AvatarMotionGroupRotate.demo.tsx?raw";
import { AvatarMotionMagnetDemo } from "./AvatarMotionMagnet.demo";
import avatarMotionMagnetSource from "./AvatarMotionMagnet.demo.tsx?raw";

export const avatarSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "instant-fade", title: "Instant fade", Demo: AvatarMotionInstantFadeDemo, source: avatarMotionInstantFadeSource },
  { id: "image-scale", title: "Image scale", Demo: AvatarMotionImageScaleDemo, source: avatarMotionImageScaleSource },
  { id: "instant-group", title: "Instant group", Demo: AvatarMotionInstantGroupDemo, source: avatarMotionInstantGroupSource },
  { id: "group-rotate", title: "Group rotate", Demo: AvatarMotionGroupRotateDemo, source: avatarMotionGroupRotateSource },
  { id: "magnet", title: "Magnet", Demo: AvatarMotionMagnetDemo, source: avatarMotionMagnetSource },
];

export function AvatarSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Avatar Slot motion demos"
      items={avatarSlotMotionGallery}
    />
  );
}
