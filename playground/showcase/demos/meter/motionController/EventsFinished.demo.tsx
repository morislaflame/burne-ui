import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Meter } from "@/components/core/Meter";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "meter:out": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "meter:rest": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function MeterMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);

  async function bounce() {
    setBusy(true);
    try {
      await controller.playSlot("track", "meter:out", { waitForComplete: true }).finished;
      await controller.playSlot("track", "meter:rest", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>
        Bounce
      </Button>
      <Meter
        label="Storage"
        showValue
        value={62}
        motionController={controller}
        motion={{ events }}
      />
    </div>
  );
}
