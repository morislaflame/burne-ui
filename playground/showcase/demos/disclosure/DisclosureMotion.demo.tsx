import { DisclosureMotionChevronDemo } from "./DisclosureMotionChevron.demo";
import { DisclosureMotionGroupChevronDemo } from "./DisclosureMotionGroupChevron.demo";
import { DisclosureMotionInstantPanelDemo } from "./DisclosureMotionInstantPanel.demo";
import { DisclosureMotionTitleDemo } from "./DisclosureMotionTitle.demo";
import { DisclosureMotionTitleLiftQuietDemo } from "./DisclosureMotionTitleLiftQuiet.demo";
import { DisclosureMotionTitleLiftTiltDemo } from "./DisclosureMotionTitleLiftTilt.demo";

export function DisclosureMotionDemo() {
  return (
    <div className="flex w-full flex-col gap-large">
      <DisclosureMotionInstantPanelDemo />
      <DisclosureMotionTitleDemo />
      <DisclosureMotionTitleLiftTiltDemo />
      <DisclosureMotionTitleLiftQuietDemo />
      <DisclosureMotionChevronDemo />
      <DisclosureMotionGroupChevronDemo />
    </div>
  );
}
