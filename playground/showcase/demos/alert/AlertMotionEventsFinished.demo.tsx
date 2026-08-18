import { useState } from "react";

import { Alert } from "@/components/core/Alert";
import { Button } from "@/components/core/Button";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "notify:up": { y: -10, duration: 0.28, ease: "power2.out", replay: "rest" },
  "notify:down": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function AlertMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);

  async function bounce() {
    setBusy(true);
    await controller.play("notify:up", { waitForComplete: true }).finished;
    await controller.play("notify:down", { waitForComplete: true }).finished;
    setBusy(false);
  }

  return (
    <div className="flex w-full flex-col gap-large">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>
        Bounce
      </Button>
      <Alert
        status="info"
        title="run.finished"
        description="Second event waits until the first MotionRun completes."
        hoverLift={false}
        motionController={controller}
        motion={{ events }}
      />
    </div>
  );
}
