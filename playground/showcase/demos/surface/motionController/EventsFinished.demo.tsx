import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Surface } from "@/components/core/Surface";
import { Text } from "@/components/core/Text";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "panel:up": { y: -10, scale: 1.03, duration: 0.28, ease: "power2.out", replay: "rest" },
  "panel:down": { y: 0, scale: 1, duration: 0.22, ease: "power2.inOut" },
});

export function SurfaceMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);

  async function bounce() {
    setBusy(true);
    await controller.play("panel:up", { waitForComplete: true }).finished;
    await controller.play("panel:down", { waitForComplete: true }).finished;
    setBusy(false);
  }

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>
        Bounce
      </Button>
      <Surface
        variant="secondary"
        padding="mid"
        radius="mid"
        className="max-w-xs"
        motionController={controller}
        motion={{ events }}
      >
        <Text as="p" variant="small">
          Second event waits until the first MotionRun completes.
        </Text>
      </Surface>
    </div>
  );
}
