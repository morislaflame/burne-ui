import { Button } from "@/components/core/Button";
import { Meter } from "@/components/core/Meter";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({
  "meter:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "meter:nudge": false });

export function MeterMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.playSlot("track", "meter:nudge")}>
          Live nudge
        </Button>
        <Button size="small" variant="ghost" onClick={() => offController.playSlot("track", "meter:nudge")}>
          Off nudge
        </Button>
      </div>
      <Meter
        label="Live"
        showValue
        value={62}
        motionController={liveController}
        motion={{ events: live }}
      />
      <Meter
        label="Off"
        showValue
        value={62}
        color="var(--color-muted-foreground)"
        motionController={offController}
        motion={{ events: off }}
      />
    </div>
  );
}
