import { useState } from "react";

import { Button } from "@/components/core/Button";
import { TextArea } from "@/components/core/TextArea";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "area:out": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "area:rest": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function TextAreaMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);

  async function bounce() {
    setBusy(true);
    try {
      await controller.playSlot("shell", "area:out", { waitForComplete: true }).finished;
      await controller.playSlot("shell", "area:rest", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>
        Bounce
      </Button>
      <TextArea
        label="Note"
        placeholder="Write a note…"
        rows={2}
        motionController={controller}
        motion={{ events }}
      />
    </div>
  );
}
