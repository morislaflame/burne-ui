import { Button } from "@/components/core/Button";
import { PinInput } from "@/components/core/PinInput";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({
  "pin:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "pin:nudge": false });

export function PinInputMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.playSlot("group", "pin:nudge")}>
          Live nudge
        </Button>
        <Button size="small" variant="ghost" onClick={() => offController.playSlot("group", "pin:nudge")}>
          Off nudge
        </Button>
      </div>
      <PinInput label="Live" length={4} motionController={liveController} motion={{ events: live }} />
      <PinInput label="Off" length={4} motionController={offController} motion={{ events: off }} />
    </div>
  );
}
