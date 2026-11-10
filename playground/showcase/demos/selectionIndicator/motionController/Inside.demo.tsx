import { SelectionIndicator } from "@/components/core/SelectionIndicator";
import { createMotionEvents, useMotionController } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({ "indicator:nudge": { y: -4, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" } });

function FillPulse() {
  const controller = useMotionController();
  return <SelectionIndicator.Fill onPointerEnter={() => controller.playSlot("fill", "indicator:nudge")} />;
}

export function SelectionIndicatorMotionControllerInsideDemo() {
  return (
    <SelectionIndicator selected check size="large" motion={{ events }}>
      <FillPulse />
      <SelectionIndicator.Mark />
    </SelectionIndicator>
  );
}
