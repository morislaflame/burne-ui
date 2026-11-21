import { Button } from "@/components/core/Button";
import { Slider } from "@/components/core/Slider";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "slider:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function SliderMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.playSlot("track", "slider:nudge")}>
        Nudge
      </Button>
      <Slider
        label="Volume"
        showValue
        defaultValue={55}
        motionController={controller}
        motion={{ events }}
      />
    </div>
  );
}
