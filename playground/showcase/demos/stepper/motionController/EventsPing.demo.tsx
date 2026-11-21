import { Button } from "@/components/core/Button";
import { Stepper } from "@/components/core/Stepper";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

import { checkoutSteps } from "../steps";

const events = createMotionEvents({
  "step:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function StepperMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex w-full flex-col gap-2xlarge">
      <Button size="small" variant="outline" type="button" onClick={() => controller.playSlot("indicator", "step:nudge")}>
        Nudge
      </Button>
      <Stepper
        aria-label="Checkout"
        defaultValue="shipping"
        steps={[...checkoutSteps]}
        motionController={controller}
        motion={{ events }}
      />
    </div>
  );
}
