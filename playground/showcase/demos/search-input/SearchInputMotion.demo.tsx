import { SearchInputMotionHoverTiltDemo } from "./SearchInputMotionHoverTilt.demo";
import { SearchInputMotionIconSpinDemo } from "./SearchInputMotionIconSpin.demo";
import { SearchInputMotionInstantExpandDemo } from "./SearchInputMotionInstantExpand.demo";
import { SearchInputMotionPressBounceDemo } from "./SearchInputMotionPressBounce.demo";

export function SearchInputMotionDemo() {
  return (
    <div className="flex w-full flex-wrap items-center gap-large">
      <SearchInputMotionInstantExpandDemo />
      <SearchInputMotionIconSpinDemo />
      <SearchInputMotionPressBounceDemo />
      <SearchInputMotionHoverTiltDemo />
    </div>
  );
}
