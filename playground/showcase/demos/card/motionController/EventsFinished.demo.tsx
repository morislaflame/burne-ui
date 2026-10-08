import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Card } from "@/components/core/Card";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "checkout:saving": { y: -6, duration: 0.35, ease: "power2.out", replay: "rest" },
  "checkout:success": { y: 0, scale: 1.03, duration: 0.28, ease: "back.out(1.7)" },
  "checkout:rest": { y: 0, scale: 1, duration: 0.2, ease: "power2.out" },
});

export function CardMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);

  async function pay() {
    setBusy(true);
    try {
      await controller.play("checkout:saving", { waitForComplete: true }).finished;
      await controller.play("checkout:success", { waitForComplete: true }).finished;
      await controller.play("checkout:rest", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void pay()}>
        Pay sequence
      </Button>
      <Card motionController={controller} motion={{ events }} className="max-w-xs">
        <Card.Header>
          <Card.Title>play() chain</Card.Title>
          <Card.Description>
            Checkout choreography is play() + finished — not playAll.
          </Card.Description>
        </Card.Header>
      </Card>
    </div>
  );
}
