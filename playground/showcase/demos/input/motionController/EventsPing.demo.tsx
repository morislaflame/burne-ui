import { Button } from "@/components/core/Button";
import { Input } from "@/components/core/Input";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "input:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function InputMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.playSlot("shell", "input:nudge")}>
        Nudge
      </Button>
      <Input
        label="Email"
        placeholder="you@example.com"
        motionController={controller}
        motion={{ events }}
      />
    </div>
  );
}
