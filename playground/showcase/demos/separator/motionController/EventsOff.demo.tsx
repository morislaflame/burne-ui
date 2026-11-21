import { Button } from "@/components/core/Button";
import { Separator } from "@/components/core/Separator";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({
  "sep:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "sep:nudge": false });

export function SeparatorMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.play("sep:nudge")}>
          Live nudge
        </Button>
        <Button size="small" variant="ghost" onClick={() => offController.play("sep:nudge")}>
          Off nudge
        </Button>
      </div>
      <Separator className="w-full" motionController={liveController} motion={{ events: live }} />
      <Separator className="w-full opacity-70" motionController={offController} motion={{ events: off }} />
    </div>
  );
}
