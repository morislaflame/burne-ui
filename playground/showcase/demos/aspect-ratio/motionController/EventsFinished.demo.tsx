import { useState } from "react";
import { Button } from "@/components/core/Button";
import { AspectRatio } from "@/components/core/AspectRatio";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "frame:out": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "frame:rest": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function AspectRatioMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);
  async function bounce() {
    setBusy(true);
    try {
      await controller.play("frame:out", { waitForComplete: true }).finished;
      await controller.play("frame:rest", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="flex w-full flex-col gap-mid">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>Bounce</Button>
      <AspectRatio ratio="16/9" motionController={controller} motion={{ events }}><span>16/9</span></AspectRatio>
    </div>
  );
}
