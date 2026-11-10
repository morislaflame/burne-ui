import { Button } from "@/components/core/Button";
import { ProgressBar } from "@/components/core/ProgressBar";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "progress:pulse": (ctx) =>
    ctx.fromRest({
      y: -4,
      duration: 0.35,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    }),
});

export function ProgressBarMotionControllerCancelDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("track", "progress:pulse")}>
          Loop
        </Button>
        <Button
          size="small"
          variant="ghost"
          onClick={() => {
            controller.cancel("track");
            controller.set("track", { y: 0 });
          }}
        >
          Cancel
        </Button>
      </div>
      <ProgressBar
        label="Upload"
        showValue
        value={62}
        motionController={controller}
        motion={{ events }}
      />
    </div>
  );
}
