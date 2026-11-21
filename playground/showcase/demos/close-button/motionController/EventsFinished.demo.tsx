import { useState } from "react";

import { Button } from "@/components/core/Button";
import { CloseButton } from "@/components/core/CloseButton";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "dismiss:out": { y: -10, scale: 1.08, duration: 0.28, ease: "power2.out", replay: "rest" },
  "dismiss:rest": { y: 0, scale: 1, duration: 0.22, ease: "power2.inOut" },
});

export function CloseButtonMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);

  async function bounce() {
    setBusy(true);
    try {
      await controller.play("dismiss:out", { waitForComplete: true }).finished;
      await controller.play("dismiss:rest", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>
        Bounce
      </Button>
      <CloseButton
        aria-label="run.finished close"
        motionController={controller}
        motion={{ events, root: { pressIn: false } }}
      />
    </div>
  );
}
