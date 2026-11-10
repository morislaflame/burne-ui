import { Button } from "@/components/core/Button";
import { Skeleton } from "@/components/core/Skeleton";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({
  "skel:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "skel:nudge": false });

export function SkeletonMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.play("skel:nudge")}>
          Live nudge
        </Button>
        <Button size="small" variant="ghost" onClick={() => offController.play("skel:nudge")}>
          Off nudge
        </Button>
      </div>
      <Skeleton className="h-8 w-full" motionController={liveController} motion={{ events: live }} />
      <Skeleton
        className="h-8 w-full opacity-70"
        motionController={offController}
        motion={{ events: off }}
      />
    </div>
  );
}
