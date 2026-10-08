import { Button } from "@/components/core/Button";
import { PinInput } from "@/components/core/PinInput";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "pin:ping": { y: -8, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function PinInputMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.playSlot("group", "pin:ping")}>
        Ping
      </Button>
      <PinInput label="Code" length={4} motionController={controller} motion={{ events }} />
    </div>
  );
}
