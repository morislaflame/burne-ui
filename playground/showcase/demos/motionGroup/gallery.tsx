import { ShowcaseDemoGallery } from "../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../layout/ShowcaseDemoGallery";

import { MotionGroupGetTargetDemo } from "./GetTarget.demo";
import getTargetSource from "./GetTarget.demo.tsx?raw";
import { MotionGroupRegisterDemo } from "./Register.demo";
import registerSource from "./Register.demo.tsx?raw";
import { MotionGroupTimelineDemo } from "./Timeline.demo";
import timelineSource from "./Timeline.demo.tsx?raw";
import { MotionGroupUnmountDemo } from "./Unmount.demo";
import unmountSource from "./Unmount.demo.tsx?raw";

export const motionGroupGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "register", title: "register / play(id)", Demo: MotionGroupRegisterDemo, source: registerSource },
  { id: "get-target", title: "getTarget(id, slot)", Demo: MotionGroupGetTargetDemo, source: getTargetSource },
  { id: "timeline", title: "timeline checkout", Demo: MotionGroupTimelineDemo, source: timelineSource },
  { id: "unmount", title: "unregister on unmount", Demo: MotionGroupUnmountDemo, source: unmountSource },
];

export function MotionGroupGalleryDemo() {
  return <ShowcaseDemoGallery aria-label="MotionGroup demos" items={motionGroupGallery} />;
}
