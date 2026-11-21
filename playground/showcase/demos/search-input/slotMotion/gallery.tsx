import { ShowcaseDemoGallery } from "../../../layout/ShowcaseDemoGallery";
import type { ShowcaseDemoGalleryItem } from "../../../layout/ShowcaseDemoGallery";

import { SearchInputMotionInstantExpandDemo } from "./SearchInputMotionInstantExpand.demo";
import searchInputMotionInstantExpandSource from "./SearchInputMotionInstantExpand.demo.tsx?raw";
import { SearchInputMotionIconSpinDemo } from "./SearchInputMotionIconSpin.demo";
import searchInputMotionIconSpinSource from "./SearchInputMotionIconSpin.demo.tsx?raw";
import { SearchInputMotionPressBounceDemo } from "./SearchInputMotionPressBounce.demo";
import searchInputMotionPressBounceSource from "./SearchInputMotionPressBounce.demo.tsx?raw";
import { SearchInputMotionHoverTiltDemo } from "./SearchInputMotionHoverTilt.demo";
import searchInputMotionHoverTiltSource from "./SearchInputMotionHoverTilt.demo.tsx?raw";

export const searchInputSlotMotionGallery: readonly ShowcaseDemoGalleryItem[] = [
  { id: "instant-expand", title: "Instant expand", Demo: SearchInputMotionInstantExpandDemo, source: searchInputMotionInstantExpandSource },
  { id: "icon-spin", title: "Icon spin", Demo: SearchInputMotionIconSpinDemo, source: searchInputMotionIconSpinSource },
  { id: "press-bounce", title: "Press bounce", Demo: SearchInputMotionPressBounceDemo, source: searchInputMotionPressBounceSource },
  { id: "hover-tilt", title: "Hover tilt", Demo: SearchInputMotionHoverTiltDemo, source: searchInputMotionHoverTiltSource },
];

export function SearchInputSlotMotionGalleryDemo() {
  return (
    <ShowcaseDemoGallery
      aria-label="SearchInput Slot motion demos"
      items={searchInputSlotMotionGallery}
    />
  );
}
