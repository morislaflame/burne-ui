import { useState } from "react";

import { Button } from "@/components/core/Button";
import { TimeField } from "@/components/core/TimeField";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "time:out": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "time:rest": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function TimeFieldMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);

  async function bounce() {
    setBusy(true);
    try {
      await controller.playSlot("shell", "time:out", { waitForComplete: true }).finished;
      await controller.playSlot("shell", "time:rest", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>
        Bounce
      </Button>
      <TimeField
        label="Start"
        defaultValue="09:30"
        motionController={controller}
        motion={{ events }}
      />
    </div>
  );
}
