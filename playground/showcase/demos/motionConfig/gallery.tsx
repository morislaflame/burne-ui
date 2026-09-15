import { ShowcaseDemoGallery } from "../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../layout/ShowcaseDemoGallery";

import { MotionConfigNestedDemo } from "./Nested.demo";
import nestedSource from "./Nested.demo.tsx?raw";
import { MotionConfigThemeDemo } from "./Theme.demo";
import themeSource from "./Theme.demo.tsx?raw";
import { MotionConfigTwoRootsDemo } from "./TwoRoots.demo";
import twoRootsSource from "./TwoRoots.demo.tsx?raw";

export const motionConfigGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "two-roots", title: "Two roots", Demo: MotionConfigTwoRootsDemo, source: twoRootsSource },
  { id: "nested", title: "Nested overlay", Demo: MotionConfigNestedDemo, source: nestedSource },
  { id: "theme", title: "ThemeProvider.motion", Demo: MotionConfigThemeDemo, source: themeSource },
];

export function MotionConfigGalleryDemo() {
  return <ShowcaseDemoGallery aria-label="MotionConfig demos" items={motionConfigGallery} />;
}
