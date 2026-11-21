import { useState } from "react";
import { Button } from "@/components/core/Button";
import { Grid } from "@/components/core/Grid";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "grid:out": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "grid:rest": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function GridMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);
  async function bounce() {
    setBusy(true);
    try {
      await controller.play("grid:out", { waitForComplete: true }).finished;
      await controller.play("grid:rest", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="flex w-full flex-col gap-mid">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>Bounce</Button>
      <Grid columns={3} gap="mid" motionController={controller} motion={{ events }}><span>Wait</span></Grid>
    </div>
  );
}
