import { useState } from "react";

import { Button } from "@/components/core/Button";
import { ProgressBar } from "@/components/core/ProgressBar";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "progress:out": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "progress:rest": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function ProgressBarMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);

  async function bounce() {
    setBusy(true);
    try {
      await controller.playSlot("track", "progress:out", { waitForComplete: true }).finished;
      await controller.playSlot("track", "progress:rest", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>
        Bounce
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
