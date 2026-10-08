import { useState } from "react";

import { Button } from "@/components/core/Button";
import { PinInput } from "@/components/core/PinInput";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "pin:up": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "pin:down": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function PinInputMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);

  async function bounce() {
    setBusy(true);
    try {
      await controller.playSlot("group", "pin:up", { waitForComplete: true }).finished;
      await controller.playSlot("group", "pin:down", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>
        Bounce
      </Button>
      <PinInput label="Code" length={4} motionController={controller} motion={{ events }} />
    </div>
  );
}
