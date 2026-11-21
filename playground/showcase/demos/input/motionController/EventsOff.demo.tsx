import { Button } from "@/components/core/Button";
import { Input } from "@/components/core/Input";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({
  "input:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "input:nudge": false });

export function InputMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.playSlot("shell", "input:nudge")}>
          Live nudge
        </Button>
        <Button size="small" variant="ghost" onClick={() => offController.playSlot("shell", "input:nudge")}>
          Off nudge
        </Button>
      </div>
      <Input
        label="Live"
        placeholder="plays"
        motionController={liveController}
        motion={{ events: live }}
      />
      <Input
        label="Off"
        placeholder="skipped"
        motionController={offController}
        motion={{ events: off }}
      />
    </div>
  );
}
