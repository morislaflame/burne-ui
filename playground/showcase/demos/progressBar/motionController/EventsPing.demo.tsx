import { Button } from "@/components/core/Button";
import { ProgressBar } from "@/components/core/ProgressBar";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "progress:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function ProgressBarMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.playSlot("track", "progress:nudge")}>
        Nudge
      </Button>
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
