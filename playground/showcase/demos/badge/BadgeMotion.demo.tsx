import { BadgeMotionAnchorPopDemo } from "./BadgeMotionAnchorPop.demo";
import { BadgeMotionDotPulseDemo } from "./BadgeMotionDotPulse.demo";
import { BadgeMotionInstantHoverDemo } from "./BadgeMotionInstantHover.demo";
import { BadgeMotionRootTiltDemo } from "./BadgeMotionRootTilt.demo";

export function BadgeMotionDemo() {
  return (
    <div className="flex w-full flex-wrap items-center gap-large">
      <BadgeMotionInstantHoverDemo />
      <BadgeMotionRootTiltDemo />
      <BadgeMotionAnchorPopDemo />
      <BadgeMotionDotPulseDemo />
    </div>
  );
}
