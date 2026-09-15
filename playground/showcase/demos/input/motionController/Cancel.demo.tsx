import { Button } from "@/components/core/Button";
import { Input } from "@/components/core/Input";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "input:pulse": (ctx) =>
    ctx.fromRest({
      y: -4,
      duration: 0.35,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    }),
});

export function InputMotionControllerCancelDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("shell", "input:pulse")}>
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
      <Input
        label="Email"
        placeholder="you@example.com"
        motionController={controller}
        motion={{ events }}
      />
    </div>
  );
}
