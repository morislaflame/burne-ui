import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Card } from "@/components/core/Card";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "checkout:saving": {
    y: -4,
    scale: 0.985,
    duration: 0.32,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut",
  },
});

export function CardMotionEventsCancelDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);

  return (
    <div className="flex w-full flex-col gap-large">
      <div className="flex flex-wrap gap-small">
        <Button
          size="small"
          variant="outline"
          disabled={busy}
          onClick={() => {
            setBusy(true);
            controller.play("checkout:saving");
          }}
        >
          Start
        </Button>
        <Button
          size="small"
          variant="ghost"
          onClick={() => {
            controller.cancel("root");
            controller.set("root", { y: 0, scale: 1 });
            setBusy(false);
          }}
        >
          Cancel
        </Button>
      </div>
      <Card motionController={controller} motion={{ events }} className="max-w-xs">
        <Card.Header>
          <Card.Title>cancel() mid-loop</Card.Title>
          <Card.Description>Stops checkout:saving and snaps the root back.</Card.Description>
        </Card.Header>
      </Card>
    </div>
  );
}
