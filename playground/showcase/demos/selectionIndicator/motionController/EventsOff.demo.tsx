import { Button } from "@/components/core/Button";
import { SelectionIndicator } from "@/components/core/SelectionIndicator";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({ "indicator:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" } });
const off = createMotionEvents({ "indicator:nudge": false });

export function SelectionIndicatorMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();
  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.play("indicator:nudge")}>Live</Button>
        <Button size="small" variant="ghost" onClick={() => offController.play("indicator:nudge")}>Off</Button>
      </div>
      <div className="flex items-center gap-large">
        <SelectionIndicator selected check size="large" motionController={liveController} motion={{ events: live }} />
        <SelectionIndicator selected check size="large" motionController={offController} motion={{ events: off }} />
      </div>
    </div>
  );
}
