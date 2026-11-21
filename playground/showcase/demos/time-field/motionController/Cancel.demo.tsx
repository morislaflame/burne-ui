import { Button } from "@/components/core/Button";
import { TimeField } from "@/components/core/TimeField";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "time:pulse": (ctx) =>
    ctx.fromRest({
      y: -4,
      duration: 0.35,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    }),
});

export function TimeFieldMotionControllerCancelDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("shell", "time:pulse")}>
          Loop
        </Button>
        <Button
          size="small"
          variant="ghost"
          onClick={() => {
            controller.cancel("shell");
            controller.set("shell", { y: 0 });
          }}
        >
          Cancel
        </Button>
      </div>
      <TimeField
        label="Start"
        defaultValue="09:30"
        motionController={controller}
        motion={{ events }}
      />
    </div>
  );
}
