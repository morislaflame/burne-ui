import { useState } from "react";
import { Button } from "@/components/core/Button";
import { ColorSlider } from "@/components/core/ColorPicker";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "slider:out": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "slider:rest": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function ColorSliderMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);
  async function bounce() {
    setBusy(true);
    try {
      await controller.playSlot("track", "slider:out", { waitForComplete: true }).finished;
      await controller.playSlot("track", "slider:rest", { waitForComplete: true }).finished;
    } finally { setBusy(false); }
  }
  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>Bounce</Button>
      <ColorSlider className="w-full max-w-sm" channel="hue" defaultValue={180} label="Hue" motionController={controller} motion={{ events }} />
    </div>
  );
}
