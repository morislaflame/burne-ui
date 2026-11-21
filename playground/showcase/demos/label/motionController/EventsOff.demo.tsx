import { Button } from "@/components/core/Button";
import { Label } from "@/components/core/Label";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({
  "label:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "label:nudge": false });

export function LabelMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.play("label:nudge")}>
          Live nudge
        </Button>
        <Button size="small" variant="ghost" onClick={() => offController.play("label:nudge")}>
          Off nudge
        </Button>
      </div>
      <Label required motionController={liveController} motion={{ events: live }}>
        Live label
      </Label>
      <Label required className="opacity-70" motionController={offController} motion={{ events: off }}>
        Events off
      </Label>
    </div>
  );
}
