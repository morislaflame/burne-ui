import { Button } from "@/components/core/Button";
import { NumberInput } from "@/components/core/NumberInput";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "qty:ping": { y: -8, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function NumberInputMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.playSlot("shell", "qty:ping")}>
        Ping
      </Button>
      <NumberInput label="Quantity" defaultValue={1} motionController={controller} motion={{ events }} />
    </div>
  );
}
