import { Button } from "@/components/core/Button";
import { SelectionIndicator } from "@/components/core/SelectionIndicator";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({ "indicator:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" } });

export function SelectionIndicatorMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();
  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.play("indicator:nudge")}>Nudge</Button>
      <SelectionIndicator selected check size="large" motionController={controller} motion={{ events }} />
    </div>
  );
}
