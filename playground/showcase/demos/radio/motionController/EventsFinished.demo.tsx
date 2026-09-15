import { useState } from "react";
import { Button } from "@/components/core/Button";
import { Radio } from "@/components/core/Radio";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "radio:out": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "radio:rest": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function RadioMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);
  async function bounce() {
    setBusy(true);
    try {
      await controller.playSlot("root", "radio:out", { waitForComplete: true }).finished;
      await controller.playSlot("root", "radio:rest", { waitForComplete: true }).finished;
    } finally { setBusy(false); }
  }
  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>Bounce</Button>
      <Radio label="Notify" defaultChecked motionController={controller} motion={{ events }} />
    </div>
  );
}
