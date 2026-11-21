import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { ToastMotionInstantLeaveDemo } from "./ToastMotionInstantLeave.demo";
import toastMotionInstantLeaveSource from "./ToastMotionInstantLeave.demo.tsx?raw";
import { ToastMotionBounceDemo } from "./ToastMotionBounce.demo";
import toastMotionBounceSource from "./ToastMotionBounce.demo.tsx?raw";
import { ToastMotionTitleStaggerDemo } from "./ToastMotionTitleStagger.demo";
import toastMotionTitleStaggerSource from "./ToastMotionTitleStagger.demo.tsx?raw";
import { ToastMotionStackSnapDemo } from "./ToastMotionStackSnap.demo";
import toastMotionStackSnapSource from "./ToastMotionStackSnap.demo.tsx?raw";

export const toastSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "instant-leave", title: "Instant leave", Demo: ToastMotionInstantLeaveDemo, source: toastMotionInstantLeaveSource },
  { id: "bounce", title: "Bounce", Demo: ToastMotionBounceDemo, source: toastMotionBounceSource },
  { id: "title-stagger", title: "Title stagger", Demo: ToastMotionTitleStaggerDemo, source: toastMotionTitleStaggerSource },
  { id: "stack-snap", title: "Stack snap", Demo: ToastMotionStackSnapDemo, source: toastMotionStackSnapSource },
];

export function ToastSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="Toast Slot motion demos"
      items={toastSlotMotionGallery}
    />
  );
}
