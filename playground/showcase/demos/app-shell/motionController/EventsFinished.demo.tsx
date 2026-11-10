import { useState } from "react";
import { Button } from "@/components/core/Button";
import { AppShell } from "@/components/core/AppShell";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "shell:out": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "shell:rest": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function AppShellMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);
  async function bounce() {
    setBusy(true);
    try {
      await controller.play("shell:out", { waitForComplete: true }).finished;
      await controller.play("shell:rest", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="flex w-full flex-col gap-mid">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>Bounce</Button>
      <AppShell motionController={controller} motion={{ events }}><span>Shell</span></AppShell>
    </div>
  );
}
