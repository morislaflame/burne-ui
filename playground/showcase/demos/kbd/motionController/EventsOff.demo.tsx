import { Button } from "@/components/core/Button";
import { Kbd } from "@/components/core/Kbd";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({
  "kbd:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "kbd:nudge": false });

export function KbdMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.play("kbd:nudge")}>
          Live nudge
        </Button>
        <Button size="small" variant="ghost" onClick={() => offController.play("kbd:nudge")}>
          Off nudge
        </Button>
      </div>
      <div className="flex flex-wrap gap-large">
        <Kbd hoverLift={false} motionController={liveController} motion={{ events: live }}>
          ⌘
        </Kbd>
        <Kbd hoverLift={false} motionController={offController} motion={{ events: off }}>
          K
        </Kbd>
      </div>
    </div>
  );
}
