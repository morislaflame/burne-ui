import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { ToggleButtonGroupMotionChangeTintDemo } from "./ToggleButtonGroupMotionChangeTint.demo";
import toggleButtonGroupMotionChangeTintSource from "./ToggleButtonGroupMotionChangeTint.demo.tsx?raw";
import { ToggleButtonGroupMotionFlipPillDemo } from "./ToggleButtonGroupMotionFlipPill.demo";
import toggleButtonGroupMotionFlipPillSource from "./ToggleButtonGroupMotionFlipPill.demo.tsx?raw";
import { ToggleButtonGroupMotionInstantEnterDemo } from "./ToggleButtonGroupMotionInstantEnter.demo";
import toggleButtonGroupMotionInstantEnterSource from "./ToggleButtonGroupMotionInstantEnter.demo.tsx?raw";
import { ToggleButtonGroupMotionRootWaveDemo } from "./ToggleButtonGroupMotionRootWave.demo";
import toggleButtonGroupMotionRootWaveSource from "./ToggleButtonGroupMotionRootWave.demo.tsx?raw";

export const toggleButtonGroupSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "instant-enter", title: "Instant enter", Demo: ToggleButtonGroupMotionInstantEnterDemo, source: toggleButtonGroupMotionInstantEnterSource },
  { id: "root-wave", title: "Root wave", Demo: ToggleButtonGroupMotionRootWaveDemo, source: toggleButtonGroupMotionRootWaveSource },
  { id: "change-tint", title: "Change tint", Demo: ToggleButtonGroupMotionChangeTintDemo, source: toggleButtonGroupMotionChangeTintSource },
  { id: "flip-pill", title: "Flip pill", Demo: ToggleButtonGroupMotionFlipPillDemo, source: toggleButtonGroupMotionFlipPillSource },
];

export function ToggleButtonGroupSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="ToggleButtonGroup Slot motion demos"
      items={toggleButtonGroupSlotMotionGallery}
    />
  );
}
