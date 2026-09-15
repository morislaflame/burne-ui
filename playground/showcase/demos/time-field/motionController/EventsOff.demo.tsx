import { Button } from "@/components/core/Button";
import { TimeField } from "@/components/core/TimeField";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({
  "time:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "time:nudge": false });

export function TimeFieldMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.playSlot("shell", "time:nudge")}>
          Live nudge
        </Button>
        <Button size="small" variant="ghost" onClick={() => offController.playSlot("shell", "time:nudge")}>
          Off nudge
        </Button>
      </div>
      <TimeField
        label="Live"
        defaultValue="09:30"
        motionController={liveController}
        motion={{ events: live }}
      />
      <TimeField
        label="Off"
        defaultValue="09:30"
        motionController={offController}
        motion={{ events: off }}
      />
    </div>
  );
}
