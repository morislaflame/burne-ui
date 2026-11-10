import { Button } from "@/components/core/Button";
import { Skeleton } from "@/components/core/Skeleton";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "skel:pulse": (ctx) =>
    ctx.fromRest({
      y: -4,
      duration: 0.35,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    }),
});

export function SkeletonMotionControllerCancelDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.play("skel:pulse")}>
          Loop
        </Button>
        <Button
          size="small"
          variant="ghost"
          onClick={() => {
            controller.cancel("root");
            controller.set("root", { y: 0 });
          }}
        >
          Cancel
        </Button>
      </div>
      <Skeleton className="h-8 w-full" motionController={controller} motion={{ events }} />
    </div>
  );
}
