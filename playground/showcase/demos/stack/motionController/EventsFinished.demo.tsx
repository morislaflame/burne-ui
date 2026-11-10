import { useState } from "react";
import { Button } from "@/components/core/Button";
import { Stack } from "@/components/core/Stack";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "stack:out": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "stack:rest": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function StackMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);
  async function bounce() {
    setBusy(true);
    try {
      await controller.play("stack:out", { waitForComplete: true }).finished;
      await controller.play("stack:rest", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="flex w-full flex-col gap-mid">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>Bounce</Button>
      <Stack orientation="horizontal" gap="mid" motionController={controller} motion={{ events }}><span>Wait</span></Stack>
    </div>
  );
}
