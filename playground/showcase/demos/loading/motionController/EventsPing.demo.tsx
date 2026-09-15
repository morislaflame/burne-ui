import { Button } from "@/components/core/Button";
import { Loading } from "@/components/core/Loading";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "load:nudge": { y: -8, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function LoadingMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex w-full flex-col items-start gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.play("load:nudge")}>
        Nudge
      </Button>
      <Loading size="large" label="Loading" motionController={controller} motion={{ events }} />
    </div>
  );
}
