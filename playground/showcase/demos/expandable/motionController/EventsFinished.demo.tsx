import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Expandable } from "@/components/core/Expandable";
import { Text } from "@/components/core/Text";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "faq:up": { x: 10, duration: 0.28, ease: "power2.out", replay: "rest" },
  "faq:down": { x: 0, duration: 0.22, ease: "power2.inOut" },
});

export function ExpandableMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);

  async function bounce() {
    setBusy(true);
    try {
      await controller.playSlot("title", "faq:up", { waitForComplete: true }).finished;
      await controller.playSlot("title", "faq:down", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>
        Bounce title
      </Button>
      <Expandable
        className="max-w-lg"
        title="run.finished"
        motionController={controller}
        motion={{ events }}
      >
        <Text as="p" variant="small" className="text-muted">
          Second playSlot waits until the first MotionRun completes.
        </Text>
      </Expandable>
    </div>
  );
}
