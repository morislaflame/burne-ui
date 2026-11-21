import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Kbd } from "@/components/core/Kbd";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "kbd:out": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "kbd:rest": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function KbdMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);

  async function bounce() {
    setBusy(true);
    try {
      await controller.play("kbd:out", { waitForComplete: true }).finished;
      await controller.play("kbd:rest", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>
        Bounce
      </Button>
      <Kbd hoverLift={false} motionController={controller} motion={{ events }}>
        ⌘
      </Kbd>
    </div>
  );
}
