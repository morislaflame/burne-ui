import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Separator } from "@/components/core/Separator";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "sep:out": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "sep:rest": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function SeparatorMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);

  async function bounce() {
    setBusy(true);
    try {
      await controller.play("sep:out", { waitForComplete: true }).finished;
      await controller.play("sep:rest", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>
        Bounce
      </Button>
      <Separator className="w-full" motionController={controller} motion={{ events }} />
    </div>
  );
}
