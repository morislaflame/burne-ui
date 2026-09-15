import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Input } from "@/components/core/Input";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "input:out": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "input:rest": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function InputMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);

  async function bounce() {
    setBusy(true);
    try {
      await controller.playSlot("shell", "input:out", { waitForComplete: true }).finished;
      await controller.playSlot("shell", "input:rest", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>
        Bounce
      </Button>
      <Input
        label="Email"
        placeholder="you@example.com"
        motionController={controller}
        motion={{ events }}
      />
    </div>
  );
}
