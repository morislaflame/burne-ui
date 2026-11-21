import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { ColorPickerMotionInstantEnterDemo } from "./ColorPickerMotionInstantEnter.demo";
import colorPickerMotionInstantEnterSource from "./ColorPickerMotionInstantEnter.demo.tsx?raw";
import { ColorPickerMotionPanelWaveDemo } from "./ColorPickerMotionPanelWave.demo";
import colorPickerMotionPanelWaveSource from "./ColorPickerMotionPanelWave.demo.tsx?raw";
import { ColorPickerMotionAreaChangeDemo } from "./ColorPickerMotionAreaChange.demo";
import colorPickerMotionAreaChangeSource from "./ColorPickerMotionAreaChange.demo.tsx?raw";
import { ColorPickerMotionAlphaInputDemo } from "./ColorPickerMotionAlphaInput.demo";
import colorPickerMotionAlphaInputSource from "./ColorPickerMotionAlphaInput.demo.tsx?raw";
import { ColorPickerMotionPreviewSwatchDemo } from "./ColorPickerMotionPreviewSwatch.demo";
import colorPickerMotionPreviewSwatchSource from "./ColorPickerMotionPreviewSwatch.demo.tsx?raw";

export const colorPickerSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "instant-enter", title: "Instant enter", Demo: ColorPickerMotionInstantEnterDemo, source: colorPickerMotionInstantEnterSource },
  { id: "panel-wave", title: "Panel wave", Demo: ColorPickerMotionPanelWaveDemo, source: colorPickerMotionPanelWaveSource },
  { id: "area-change", title: "Area change", Demo: ColorPickerMotionAreaChangeDemo, source: colorPickerMotionAreaChangeSource },
  { id: "alpha-input", title: "Alpha input", Demo: ColorPickerMotionAlphaInputDemo, source: colorPickerMotionAlphaInputSource },
  { id: "preview-swatch", title: "Preview swatch", Demo: ColorPickerMotionPreviewSwatchDemo, source: colorPickerMotionPreviewSwatchSource },
];

export function ColorPickerSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="ColorPicker Slot motion demos"
      align="stretch"
      items={colorPickerSlotMotionGallery}
    />
  );
}
