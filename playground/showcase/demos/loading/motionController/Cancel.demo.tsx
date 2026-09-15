import { Button } from "@/components/core/Button";
import { Loading } from "@/components/core/Loading";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "load:pulse": (ctx) =>
    ctx.fromRest({
      y: -6,
      duration: 0.35,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    }),
});

export function LoadingMotionControllerCancelDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex w-full flex-col items-start gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.play("load:pulse")}>
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
      <Loading size="large" label="Loading" motionController={controller} motion={{ events }} />
    </div>
  );
}
