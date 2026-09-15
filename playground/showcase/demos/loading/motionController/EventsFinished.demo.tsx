import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Loading } from "@/components/core/Loading";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "load:out": { y: -10, scale: 1.06, duration: 0.28, ease: "power2.out", replay: "rest" },
  "load:rest": { y: 0, scale: 1, duration: 0.22, ease: "power2.inOut" },
});

export function LoadingMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);

  async function bounce() {
    setBusy(true);
    try {
      await controller.play("load:out", { waitForComplete: true }).finished;
      await controller.play("load:rest", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex w-full flex-col items-start gap-2xlarge">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>
        Bounce
      </Button>
      <Loading size="large" label="Loading" motionController={controller} motion={{ events }} />
    </div>
  );
}
