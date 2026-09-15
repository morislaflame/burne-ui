import { Button } from "@/components/core/Button";
import { Checkbox } from "@/components/core/Checkbox";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({ "check:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" } });
const off = createMotionEvents({ "check:nudge": false });

export function CheckboxMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();
  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.playSlot("root", "check:nudge")}>Live</Button>
        <Button size="small" variant="ghost" onClick={() => offController.playSlot("root", "check:nudge")}>Off</Button>
      </div>
      <Checkbox label="Live" defaultChecked motionController={liveController} motion={{ events: live }} />
      <Checkbox label="Off" defaultChecked motionController={offController} motion={{ events: off }} />
    </div>
  );
}
