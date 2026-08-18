import { SwitchMotionBounceThumbDemo } from "./SwitchMotionBounceThumb.demo";
import { SwitchMotionDefaultDemo } from "./SwitchMotionDefault.demo";
import { SwitchMotionFillFadeDemo } from "./SwitchMotionFillFade.demo";
import { SwitchMotionIconsDemo } from "./SwitchMotionIcons.demo";
import { SwitchMotionInstantThumbDemo } from "./SwitchMotionInstantThumb.demo";
import { SwitchMotionLabelColorDemo } from "./SwitchMotionLabelColor.demo";
import { SwitchMotionTrackDemo } from "./SwitchMotionTrack.demo";

export function SwitchMotionDemo() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-large">
      <SwitchMotionDefaultDemo />
      <SwitchMotionInstantThumbDemo />
      <SwitchMotionBounceThumbDemo />
      <SwitchMotionFillFadeDemo />
      <SwitchMotionIconsDemo />
      <SwitchMotionLabelColorDemo />
      <SwitchMotionTrackDemo />
    </div>
  );
}
