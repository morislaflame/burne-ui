import { useState } from "react";
import { Button } from "@/components/core/Button";
import { Header } from "@/components/core/Header";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "header:out": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "header:rest": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function HeaderMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);
  async function bounce() {
    setBusy(true);
    try {
      await controller.play("header:out", { waitForComplete: true }).finished;
      await controller.play("header:rest", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="flex w-full flex-col gap-mid">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>Bounce</Button>
      <Header motionController={controller} motion={{ events }}>Title</Header>
    </div>
  );
}
