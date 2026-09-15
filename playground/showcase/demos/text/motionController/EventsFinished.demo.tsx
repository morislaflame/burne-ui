import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Text } from "@/components/core/Text";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "text:out": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "text:rest": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function TextMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);

  async function bounce() {
    setBusy(true);
    try {
      await controller.play("text:out", { waitForComplete: true }).finished;
      await controller.play("text:rest", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>
        Bounce
      </Button>
      <Text variant="large" motionController={controller} motion={{ events }}>
        Wait for complete
      </Text>
    </div>
  );
}
