import { KbdMotionInstantHoverDemo } from "./KbdMotionInstantHover.demo";
import { KbdMotionKeyBounceDemo } from "./KbdMotionKeyBounce.demo";
import { KbdMotionRootTiltDemo } from "./KbdMotionRootTilt.demo";
import { KbdMotionTextPopDemo } from "./KbdMotionTextPop.demo";

export function KbdMotionDemo() {
  return (
    <div className="flex w-full flex-wrap items-center gap-large">
      <KbdMotionInstantHoverDemo />
      <KbdMotionRootTiltDemo />
      <KbdMotionTextPopDemo />
      <KbdMotionKeyBounceDemo />
    </div>
  );
}
