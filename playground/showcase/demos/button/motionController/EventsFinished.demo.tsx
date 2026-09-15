import { useState } from "react";

import { Button } from "@/components/core/Button";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "cta:up": { y: -10, scale: 1.06, duration: 0.28, ease: "power2.out", replay: "rest" },
  "cta:down": { y: 0, scale: 1, duration: 0.22, ease: "power2.inOut" },
});

export function ButtonMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);

  async function bounce() {
    setBusy(true);
    try {
      await controller.play("cta:up", { waitForComplete: true }).finished;
      await controller.play("cta:down", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>
        Bounce
      </Button>
      <Button
        variant="primary"
        motionController={controller}
        motion={{ events, root: { pressIn: false } }}
      >
        run.finished
      </Button>
    </div>
  );
}
