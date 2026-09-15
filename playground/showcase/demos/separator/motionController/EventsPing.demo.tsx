import { Button } from "@/components/core/Button";
import { Separator } from "@/components/core/Separator";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "sep:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function SeparatorMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.play("sep:nudge")}>
        Nudge
      </Button>
      <Separator className="w-full" motionController={controller} motion={{ events }} />
    </div>
  );
}
