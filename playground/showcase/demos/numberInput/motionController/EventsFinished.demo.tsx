import { useState } from "react";

import { Button } from "@/components/core/Button";
import { NumberInput } from "@/components/core/NumberInput";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "qty:up": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "qty:down": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function NumberInputMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);

  async function bounce() {
    setBusy(true);
    try {
      await controller.playSlot("shell", "qty:up", { waitForComplete: true }).finished;
      await controller.playSlot("shell", "qty:down", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>
        Bounce
      </Button>
      <NumberInput label="Quantity" defaultValue={1} motionController={controller} motion={{ events }} />
    </div>
  );
}
