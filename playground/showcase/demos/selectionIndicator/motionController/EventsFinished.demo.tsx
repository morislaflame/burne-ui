import { useState } from "react";
import { Button } from "@/components/core/Button";
import { SelectionIndicator } from "@/components/core/SelectionIndicator";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "indicator:out": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "indicator:rest": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function SelectionIndicatorMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);
  async function bounce() {
    setBusy(true);
    try {
      await controller.play("indicator:out", { waitForComplete: true }).finished;
      await controller.play("indicator:rest", { waitForComplete: true }).finished;
    } finally { setBusy(false); }
  }
  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>Bounce</Button>
      <SelectionIndicator selected check size="large" motionController={controller} motion={{ events }} />
    </div>
  );
}
