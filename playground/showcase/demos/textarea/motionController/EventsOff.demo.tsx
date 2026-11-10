import { Button } from "@/components/core/Button";
import { TextArea } from "@/components/core/TextArea";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({
  "area:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "area:nudge": false });

export function TextAreaMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.playSlot("shell", "area:nudge")}>
          Live nudge
        </Button>
        <Button size="small" variant="ghost" onClick={() => offController.playSlot("shell", "area:nudge")}>
          Off nudge
        </Button>
      </div>
      <TextArea
        label="Live"
        placeholder="plays"
        rows={2}
        motionController={liveController}
        motion={{ events: live }}
      />
      <TextArea
        label="Off"
        placeholder="skipped"
        rows={2}
        motionController={offController}
        motion={{ events: off }}
      />
    </div>
  );
}
