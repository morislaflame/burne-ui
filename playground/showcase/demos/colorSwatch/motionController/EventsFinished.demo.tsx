import { useState } from "react";
import { Button } from "@/components/core/Button";
import { ColorSwatch } from "@/components/core/ColorPicker";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "swatch:out": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "swatch:rest": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function ColorSwatchMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);
  async function bounce() {
    setBusy(true);
    try {
      await controller.play("swatch:out", { waitForComplete: true }).finished;
      await controller.play("swatch:rest", { waitForComplete: true }).finished;
    } finally { setBusy(false); }
  }
  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>Bounce</Button>
      <ColorSwatch color="#3b82f6" size="large" aria-label="Accent" onClick={() => undefined} motionController={controller} motion={{ events }} />
    </div>
  );
}
