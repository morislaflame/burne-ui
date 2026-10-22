import { useState } from "react";
import { Button } from "@/components/core/Button";
import { Container } from "@/components/core/Container";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "container:out": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "container:rest": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function ContainerMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);
  async function bounce() {
    setBusy(true);
    try {
      await controller.play("container:out", { waitForComplete: true }).finished;
      await controller.play("container:rest", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="flex w-full flex-col gap-mid">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>Bounce</Button>
      <Container maxWidth="mid" padding="mid" motionController={controller} motion={{ events }}><span>Wait</span></Container>
    </div>
  );
}
