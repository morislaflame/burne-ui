import { AccordionMotionBounceHeightDemo } from "./AccordionMotionBounceHeight.demo";
import { AccordionMotionChevronDemo } from "./AccordionMotionChevron.demo";
import { AccordionMotionInstantPanelDemo } from "./AccordionMotionInstantPanel.demo";

export function AccordionMotionDemo() {
  return (
    <div className="flex w-full flex-col gap-large">
      <AccordionMotionInstantPanelDemo />
      <AccordionMotionChevronDemo />
      <AccordionMotionBounceHeightDemo />
    </div>
  );
}
