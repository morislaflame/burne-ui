import { Button } from "@/components/core/Button";
import { Label } from "@/components/core/Label";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "label:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function LabelMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.play("label:nudge")}>
        Nudge
      </Button>
      <Label required motionController={controller} motion={{ events }}>
        Email
      </Label>
    </div>
  );
}
