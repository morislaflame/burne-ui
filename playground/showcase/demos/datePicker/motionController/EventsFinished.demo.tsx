import { useState } from "react";

import { Button } from "@/components/core/Button";
import { DatePicker } from "@/components/core/DatePicker";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "date:up": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "date:down": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function DatePickerMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);

  async function bounce() {
    setBusy(true);
    try {
      await controller.playSlot("trigger", "date:up", { waitForComplete: true }).finished;
      await controller.playSlot("trigger", "date:down", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>
        Bounce
      </Button>
      <DatePicker label="Date" motionController={controller} motion={{ events }} />
    </div>
  );
}
