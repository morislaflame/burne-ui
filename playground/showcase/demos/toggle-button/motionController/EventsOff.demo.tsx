import { Button } from "@/components/core/Button";
import { ToggleButton } from "@/components/core/ToggleButton";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";
import { IoHeartOutline } from "react-icons/io5";

const live = createMotionEvents({
  "like:nudge": { y: -8, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "like:nudge": false });

export function ToggleButtonMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.play("like:nudge")}>
          Live nudge
        </Button>
        <Button size="small" variant="ghost" onClick={() => offController.play("like:nudge")}>
          Off nudge
        </Button>
      </div>
      <div className="flex items-center gap-large">
        <ToggleButton
          variant="outline"
          icon={<IoHeartOutline aria-hidden />}
          motionController={liveController}
          motion={{ events: live, root: { pressIn: false } }}
        >
          Live
        </ToggleButton>
        <ToggleButton
          variant="ghost"
          icon={<IoHeartOutline aria-hidden />}
          motionController={offController}
          motion={{ events: off, root: { pressIn: false } }}
        >
          Off
        </ToggleButton>
      </div>
    </div>
  );
}
