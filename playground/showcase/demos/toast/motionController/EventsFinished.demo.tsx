import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Toast } from "@/components/core/Toast";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "toast:out": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "toast:rest": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function ToastMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);

  async function bounce() {
    setBusy(true);
    try {
      await controller.playSlot("root", "toast:out", { waitForComplete: true }).finished;
      await controller.playSlot("root", "toast:rest", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-[22rem] w-full max-w-lg flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>
          Bounce
        </Button>
      </div>
      <Toast
        title="Saved"
        description="Standalone card — slots stay live."
        motionController={controller}
        motion={{ events }}
      />
    </div>
  );
}
