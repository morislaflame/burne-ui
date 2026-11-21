import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Card } from "@/components/core/Card";
import { createMotionFactory, createMotionStates, type MotionPayload } from "@/components/core/utils/slotMotion";

type CheckoutMode = "idle" | "paying" | "paid" | "failed";

type CheckoutPayload = MotionPayload & {
  tries: number;
};

const failedShake = createMotionFactory<CheckoutPayload>((ctx) => {
  const tries = ctx.payload?.tries ?? 1;
  return ctx.fromRest({
    x: tries > 1 ? 9 : 7,
    y: 0,
    scale: 1,
    duration: 0.07,
    yoyo: true,
    repeat: 5,
  });
});

const states = createMotionStates({
  idle: {
    root: { y: 0, scale: 1, autoAlpha: 1, duration: 0.22 },
    title: { y: 0, duration: 0.22 },
  },
  paying: {
    root: { y: -4, scale: 0.985, duration: 0.32, yoyo: true, repeat: -1, ease: "sine.inOut" },
    title: { y: 2, duration: 0.28 },
  },
  paid: {
    root: { y: 0, scale: 1, autoAlpha: 1, duration: 0.28, ease: "back.out(1.7)" },
    title: { y: 0, duration: 0.22 },
  },
  failed: {
    root: failedShake,
    title: { y: 0, duration: 0.2 },
  },
});

function wait(ms: number) {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });
}

export function CardMotionStatesCheckoutDemo() {
  const [mode, setMode] = useState<CheckoutMode>("idle");
  const [tries, setTries] = useState(0);

  async function run(ok: boolean) {
    setMode("paying");
    await wait(900);
    if (ok) {
      setMode("paid");
      return;
    }
    setTries((n) => n + 1);
    setMode("failed");
  }

  const label = mode === "paying" ? "Paying…" : mode === "paid" ? "Paid" : "Pay $24";

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" disabled={mode === "paying"} onClick={() => void run(true)}>
          Pay
        </Button>
        <Button size="small" variant="ghost" disabled={mode === "paying"} onClick={() => void run(false)}>
          Decline
        </Button>
      </div>
      <Card motionState={mode} motionPayload={{ tries }} motion={{ states }} className="max-w-xs">
        <Card.Header>
          <Card.Title>Checkout</Card.Title>
          <Card.Description>
            Shake reads ctx.payload.tries — not a closure over React state.
          </Card.Description>
        </Card.Header>
        <Card.Footer>
          <Button size="small" disabled={mode === "paying"} onClick={() => void run(true)}>
            {label}
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
}
