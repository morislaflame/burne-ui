import { Alert } from "@/components/core/Alert";
import { Button } from "@/components/core/Button";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "spin:start": (ctx) =>
    ctx.fromRest({
      y: -5,
      rotation: 2,
      duration: 0.35,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    }),
});

export function AlertMotionControllerCancelDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.play("spin:start")}>
          Loop
        </Button>
        <Button
          size="small"
          variant="ghost"
          onClick={() => {
            controller.cancel("root");
            controller.set("root", { y: 0, rotation: 0 });
          }}
        >
          Cancel
        </Button>
      </div>
      <Alert
        status="warning"
        title="cancel()"
        description="Stops the looping run on the root slot."
        hoverLift={false}
        motionController={controller}
        motion={{ events }}
      />
    </div>
  );
}
