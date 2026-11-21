import { Button } from "@/components/core/Button";
import { Radio } from "@/components/core/Radio";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({ "radio:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" } });
const off = createMotionEvents({ "radio:nudge": false });

export function RadioMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();
  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.playSlot("root", "radio:nudge")}>Live</Button>
        <Button size="small" variant="ghost" onClick={() => offController.playSlot("root", "radio:nudge")}>Off</Button>
      </div>
      <Radio name="mc-live" label="Live" defaultChecked motionController={liveController} motion={{ events: live }} />
      <Radio name="mc-off" label="Off" defaultChecked motionController={offController} motion={{ events: off }} />
    </div>
  );
}
