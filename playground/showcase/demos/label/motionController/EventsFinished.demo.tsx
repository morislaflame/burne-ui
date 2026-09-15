import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Label } from "@/components/core/Label";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "label:out": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "label:rest": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function LabelMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);

  async function bounce() {
    setBusy(true);
    try {
      await controller.play("label:out", { waitForComplete: true }).finished;
      await controller.play("label:rest", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>
        Bounce
      </Button>
      <Label required motionController={controller} motion={{ events }}>
        Email
      </Label>
    </div>
  );
}
