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
  "checkout:success": { y: 0, scale: 1, duration: 0.28, ease: "back.out(1.7)" },
  "checkout:error": {
    x: 7,
    y: 0,
    scale: 1,
    duration: 0.07,
    yoyo: true,
    repeat: 5,
  },
});

function wait(ms: number) {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });
}

export function CardMotionEventsCheckoutDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);
  const [label, setLabel] = useState("Pay $24");

  async function run(ok: boolean) {
    setBusy(true);
    setLabel("Paying…");
    controller.play("checkout:saving");
    await wait(900);
    controller.play(ok ? "checkout:success" : "checkout:error");
    setLabel(ok ? "Paid" : "Pay $24");
    setBusy(false);
  }

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" disabled={busy} onClick={() => void run(true)}>
          Pay
        </Button>
        <Button size="small" variant="ghost" disabled={busy} onClick={() => void run(false)}>
          Decline
        </Button>
      </div>
      <Card motionController={controller} motion={{ events }} className="max-w-xs">
        <Card.Header>
          <Card.Title>Checkout</Card.Title>
          <Card.Description>saving / success / error from the store — not hoverIn.</Card.Description>
        </Card.Header>
        <Card.Footer>
          <Button size="small" disabled={busy} onClick={() => void run(true)}>
            {label}
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
}
