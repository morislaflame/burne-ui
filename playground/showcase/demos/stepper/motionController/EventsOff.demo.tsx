import { Button } from "@/components/core/Button";
import { Stepper } from "@/components/core/Stepper";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

import { checkoutSteps } from "../steps";

const live = createMotionEvents({
  "step:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "step:nudge": false });

export function StepperMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();

  return (
    <div className="flex w-full flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" type="button" onClick={() => liveController.playSlot("indicator", "step:nudge")}>
          Live nudge
        </Button>
        <Button size="small" variant="ghost" type="button" onClick={() => offController.playSlot("indicator", "step:nudge")}>
          Off nudge
        </Button>
      </div>
      <Stepper
        aria-label="Live"
        defaultValue="shipping"
        steps={[...checkoutSteps]}
        motionController={liveController}
        motion={{ events: live }}
      />
      <Stepper
        aria-label="Off"
        defaultValue="shipping"
        steps={[...checkoutSteps]}
        motionController={offController}
        motion={{ events: off }}
      />
    </div>
  );
}
