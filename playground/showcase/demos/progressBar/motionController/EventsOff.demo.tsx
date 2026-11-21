import { Button } from "@/components/core/Button";
import { ProgressBar } from "@/components/core/ProgressBar";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({
  "progress:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "progress:nudge": false });

export function ProgressBarMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.playSlot("track", "progress:nudge")}>
          Live nudge
        </Button>
        <Button size="small" variant="ghost" onClick={() => offController.playSlot("track", "progress:nudge")}>
          Off nudge
        </Button>
      </div>
      <ProgressBar
        label="Live"
        showValue
        value={62}
        motionController={liveController}
        motion={{ events: live }}
      />
      <ProgressBar
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
