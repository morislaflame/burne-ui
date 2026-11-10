import { useState } from "react";

import { Button } from "@/components/core/Button";
import { ColorPicker } from "@/components/core/ColorPicker";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "picker:out": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "picker:rest": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function ColorPickerMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);

  async function bounce() {
    setBusy(true);
    try {
      await controller.playSlot("contentPanel", "picker:out", { waitForComplete: true }).finished;
      await controller.playSlot("contentPanel", "picker:rest", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-[28rem] w-full max-w-sm flex-col gap-2xlarge">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>
        Bounce
      </Button>
      <ColorPicker open defaultValue="#3b82f6" motionController={controller} motion={{ events }}>
        <ColorPicker.Trigger />
        <ColorPicker.Content />
      </ColorPicker>
    </div>
  );
}
