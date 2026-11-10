import { useState } from "react";
import { Button } from "@/components/core/Button";
import { Sidebar } from "@/components/core/Sidebar";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "sidebar:out": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "sidebar:rest": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function SidebarMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);
  async function bounce() {
    setBusy(true);
    try {
      await controller.play("sidebar:out", { waitForComplete: true }).finished;
      await controller.play("sidebar:rest", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="flex w-full flex-col gap-mid">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>Bounce</Button>
      <Sidebar aria-label="Sections" motionController={controller} motion={{ events }}>Nav</Sidebar>
    </div>
  );
}
