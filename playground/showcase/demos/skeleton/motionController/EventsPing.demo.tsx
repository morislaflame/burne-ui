import { Button } from "@/components/core/Button";
import { Skeleton } from "@/components/core/Skeleton";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "skel:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function SkeletonMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.play("skel:nudge")}>
        Nudge
      </Button>
      <Skeleton className="h-8 w-full" motionController={controller} motion={{ events }} />
    </div>
  );
}
