import { Button } from "@/components/core/Button";
import { Switch } from "@/components/core/Switch";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({ "switch:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" } });
const off = createMotionEvents({ "switch:nudge": false });

export function SwitchMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();
  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.playSlot("track", "switch:nudge")}>Live</Button>
        <Button size="small" variant="ghost" onClick={() => offController.playSlot("track", "switch:nudge")}>Off</Button>
      </div>
      <Switch label="Live" defaultChecked motionController={liveController} motion={{ events: live }} />
      <Switch label="Off" defaultChecked motionController={offController} motion={{ events: off }} />
    </div>
  );
}
