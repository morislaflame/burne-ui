import { useState } from "react";
import { Button } from "@/components/core/Button";
import { Switch } from "@/components/core/Switch";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "switch:out": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "switch:rest": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function SwitchMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);
  async function bounce() {
    setBusy(true);
    try {
      await controller.playSlot("track", "switch:out", { waitForComplete: true }).finished;
      await controller.playSlot("track", "switch:rest", { waitForComplete: true }).finished;
    } finally { setBusy(false); }
  }
  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>Bounce</Button>
      <Switch label="Notify" defaultChecked motionController={controller} motion={{ events }} />
    </div>
  );
}
