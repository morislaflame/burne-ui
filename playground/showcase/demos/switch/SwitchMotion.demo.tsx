import { SwitchMotionBounceThumbDemo } from "./SwitchMotionBounceThumb.demo";
import { SwitchMotionDefaultDemo } from "./SwitchMotionDefault.demo";
import { SwitchMotionFillFadeDemo } from "./SwitchMotionFillFade.demo";
import { SwitchMotionIconsDemo } from "./SwitchMotionIcons.demo";
import { SwitchMotionInstantThumbDemo } from "./SwitchMotionInstantThumb.demo";

export function SwitchMotionDemo() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-large">
      <SwitchMotionDefaultDemo />
      <SwitchMotionInstantThumbDemo />
      <SwitchMotionBounceThumbDemo />
      <SwitchMotionFillFadeDemo />
      <SwitchMotionIconsDemo />
    </div>
  );
}
