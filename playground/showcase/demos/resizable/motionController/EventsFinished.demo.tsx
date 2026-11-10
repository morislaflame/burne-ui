import { useState } from "react";
import { Button } from "@/components/core/Button";
import { Resizable } from "@/components/core/Resizable";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "split:out": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "split:rest": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function ResizableMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);
  async function bounce() {
    setBusy(true);
    try {
      await controller.play("split:out", { waitForComplete: true }).finished;
      await controller.play("split:rest", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="flex w-full flex-col gap-mid">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>Bounce</Button>
      <Resizable motionController={controller} motion={{ events }}><Resizable.Panel>A</Resizable.Panel><Resizable.Handle /><Resizable.Panel>B</Resizable.Panel></Resizable>
    </div>
  );
}
