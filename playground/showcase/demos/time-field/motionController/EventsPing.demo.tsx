import { Button } from "@/components/core/Button";
import { TimeField } from "@/components/core/TimeField";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "time:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function TimeFieldMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.playSlot("shell", "time:nudge")}>
        Nudge
      </Button>
      <TimeField
        label="Start"
        defaultValue="09:30"
        motionController={controller}
        motion={{ events }}
      />
    </div>
  );
}
