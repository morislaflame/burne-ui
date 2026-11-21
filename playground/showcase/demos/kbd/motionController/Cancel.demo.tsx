import { Button } from "@/components/core/Button";
import { Kbd } from "@/components/core/Kbd";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "kbd:pulse": (ctx) =>
    ctx.fromRest({
      y: -4,
      duration: 0.35,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    }),
});

export function KbdMotionControllerCancelDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.play("kbd:pulse")}>
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
      <Kbd hoverLift={false} motionController={controller} motion={{ events }}>
        ⌘
      </Kbd>
    </div>
  );
}
