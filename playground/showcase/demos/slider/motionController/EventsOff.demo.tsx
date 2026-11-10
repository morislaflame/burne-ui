import { Button } from "@/components/core/Button";
import { Slider } from "@/components/core/Slider";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({
  "slider:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "slider:nudge": false });

export function SliderMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.playSlot("track", "slider:nudge")}>
          Live nudge
        </Button>
        <Button size="small" variant="ghost" onClick={() => offController.playSlot("track", "slider:nudge")}>
          Off nudge
        </Button>
      </div>
      <Slider
        label="Live"
        showValue
        defaultValue={55}
        motionController={liveController}
        motion={{ events: live }}
      />
      <Slider
        label="Off"
        showValue
        defaultValue={55}
        motionController={offController}
        motion={{ events: off }}
      />
    </div>
  );
}
