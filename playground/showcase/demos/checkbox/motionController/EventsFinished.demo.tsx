import { useState } from "react";
import { Button } from "@/components/core/Button";
import { Checkbox } from "@/components/core/Checkbox";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "check:out": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "check:rest": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function CheckboxMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);
  async function bounce() {
    setBusy(true);
    try {
      await controller.playSlot("root", "check:out", { waitForComplete: true }).finished;
      await controller.playSlot("root", "check:rest", { waitForComplete: true }).finished;
    } finally { setBusy(false); }
  }
  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>Bounce</Button>
      <Checkbox label="Notify" defaultChecked motionController={controller} motion={{ events }} />
    </div>
  );
}
