import { Button } from "@/components/core/Button";
import { Loading } from "@/components/core/Loading";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({
  "load:nudge": { y: -8, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "load:nudge": false });

export function LoadingMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();

  return (
    <div className="flex w-full flex-col items-start gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.play("load:nudge")}>
          Live nudge
        </Button>
        <Button size="small" variant="ghost" onClick={() => offController.play("load:nudge")}>
          Off nudge
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-large">
        <Loading size="large" label="Live loading" motionController={liveController} motion={{ events: live }} />
        <Loading
          size="large"
          color="muted"
          label="Off loading"
          motionController={offController}
          motion={{ events: off }}
        />
      </div>
    </div>
  );
}
