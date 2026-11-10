import { Button } from "@/components/core/Button";
import { CloseButton } from "@/components/core/CloseButton";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({
  "dismiss:nudge": { y: -8, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "dismiss:nudge": false });

export function CloseButtonMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.play("dismiss:nudge")}>
          Live nudge
        </Button>
        <Button size="small" variant="ghost" onClick={() => offController.play("dismiss:nudge")}>
          Off nudge
        </Button>
      </div>
      <div className="flex items-center gap-large">
        <CloseButton
          aria-label="events on close"
          motionController={liveController}
          motion={{ events: live, root: { pressIn: false } }}
        />
        <CloseButton
          aria-label="events off close"
          variant="outline"
          motionController={offController}
          motion={{ events: off, root: { pressIn: false } }}
        />
      </div>
    </div>
  );
}
