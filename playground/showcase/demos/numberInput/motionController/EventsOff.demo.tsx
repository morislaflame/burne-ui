import { Button } from "@/components/core/Button";
import { NumberInput } from "@/components/core/NumberInput";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({
  "qty:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "qty:nudge": false });

export function NumberInputMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.playSlot("shell", "qty:nudge")}>
          Live nudge
        </Button>
        <Button size="small" variant="ghost" onClick={() => offController.playSlot("shell", "qty:nudge")}>
          Off nudge
        </Button>
      </div>
      <NumberInput label="Live" defaultValue={1} motionController={liveController} motion={{ events: live }} />
      <NumberInput label="Off" defaultValue={1} motionController={offController} motion={{ events: off }} />
    </div>
  );
}
