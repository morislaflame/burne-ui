import { Button } from "@/components/core/Button";
import { DatePicker } from "@/components/core/DatePicker";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "date:ping": { y: -8, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function DatePickerMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.playSlot("trigger", "date:ping")}>
        Ping
      </Button>
      <DatePicker label="Date" motionController={controller} motion={{ events }} />
    </div>
  );
}
