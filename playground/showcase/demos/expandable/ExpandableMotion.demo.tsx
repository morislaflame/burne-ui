import { ExpandableMotionChevronDemo } from "./ExpandableMotionChevron.demo";
import { ExpandableMotionDefaultDemo } from "./ExpandableMotionDefault.demo";
import { ExpandableMotionInstantPanelDemo } from "./ExpandableMotionInstantPanel.demo";
import { ExpandableMotionBounceHeightDemo } from "./ExpandableMotionBounceHeight.demo";
import { ExpandableMotionClipWipeDemo } from "./ExpandableMotionClipWipe.demo";
import { ExpandableMotionPanelInnerDemo } from "./ExpandableMotionPanelInner.demo";
import { ExpandableMotionTitleColorDemo } from "./ExpandableMotionTitleColor.demo";

export function ExpandableMotionDemo() {
  return (
    <div className="flex w-full flex-col gap-large">
      <ExpandableMotionDefaultDemo />
      <ExpandableMotionInstantPanelDemo />
      <ExpandableMotionChevronDemo />
      <ExpandableMotionBounceHeightDemo />
      <ExpandableMotionClipWipeDemo />
      <ExpandableMotionPanelInnerDemo />
      <ExpandableMotionTitleColorDemo />
    </div>
  );
}
