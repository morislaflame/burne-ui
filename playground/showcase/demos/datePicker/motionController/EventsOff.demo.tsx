import { Button } from "@/components/core/Button";
import { DatePicker } from "@/components/core/DatePicker";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({
  "date:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "date:nudge": false });

export function DatePickerMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.playSlot("trigger", "date:nudge")}>
          Live nudge
        </Button>
        <Button size="small" variant="ghost" onClick={() => offController.playSlot("trigger", "date:nudge")}>
          Off nudge
        </Button>
      </div>
      <DatePicker label="Live" motionController={liveController} motion={{ events: live }} />
      <DatePicker label="Off" motionController={offController} motion={{ events: off }} />
    </div>
  );
}
