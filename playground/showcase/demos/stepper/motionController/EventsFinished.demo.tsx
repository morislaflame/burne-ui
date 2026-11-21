import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Stepper } from "@/components/core/Stepper";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

import { checkoutSteps } from "../steps";

const events = createMotionEvents({
  "step:up": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "step:down": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function StepperMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);

  async function bounce() {
    setBusy(true);
    try {
      await controller.playSlot("indicator", "step:up", { waitForComplete: true }).finished;
      await controller.playSlot("indicator", "step:down", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex w-full flex-col gap-2xlarge">
      <Button size="small" variant="outline" type="button" disabled={busy} onClick={() => void bounce()}>
        Bounce
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
