import { useRef, useState } from "react";

import { Alert } from "@/components/core/Alert";
import { Button } from "@/components/core/Button";
import { Card } from "@/components/core/Card";
import {
  createMotionEvents,
  useMotionControllerHandle,
  useMotionGroupHandle,
  useMotionGroupMember,
  type MotionGroupTimeline,
} from "@/components/core/utils/slotMotion";

const alertEvents = createMotionEvents({
  "notify:ping": { y: -8, duration: 0.16, yoyo: true, repeat: 1 },
  "notify:ok": { y: 0, duration: 0.2 },
  "notify:err": { x: 6, duration: 0.07, yoyo: true, repeat: 5 },
});

const cardEvents = createMotionEvents({
  "checkout:saving": {
    y: -4,
    scale: 0.985,
    duration: 0.32,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut",
  },
  "checkout:success": { y: 0, scale: 1, duration: 0.28, ease: "back.out(1.7)" },
  "checkout:error": { x: 7, y: 0, scale: 1, duration: 0.07, yoyo: true, repeat: 5 },
});

const payEvents = createMotionEvents({
  "cta:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

function wait(ms: number) {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });
}

export function MotionGroupTimelineDemo() {
  const group = useMotionGroupHandle();
  const alert = useMotionControllerHandle();
  const card = useMotionControllerHandle();
  const pay = useMotionControllerHandle();
  useMotionGroupMember("alert", alert, group);
  useMotionGroupMember("card", card, group);
  useMotionGroupMember("pay", pay, group);
  const tlRef = useRef<MotionGroupTimeline | null>(null);
  const busyRef = useRef(false);
  const genRef = useRef(0);
  const [busy, setBusy] = useState(false);
  const [label, setLabel] = useState("Pay $24");

  async function run(ok: boolean) {
    if (busyRef.current) return;
    const gen = ++genRef.current;
    busyRef.current = true;
    tlRef.current?.kill();
    setBusy(true);
    setLabel("Paying…");
    const tl = group.timeline();
    tlRef.current = tl;
    tl.play("alert", "notify:ping", { position: 0 });
    tl.play("card", "checkout:saving", { position: "+=0.12" });
    tl.play("pay", "cta:nudge", { position: "<" });
    await wait(900);
    if (gen !== genRef.current) return;
    group.play("card", ok ? "checkout:success" : "checkout:error");
    group.play("alert", ok ? "notify:ok" : "notify:err");
    setLabel(ok ? "Paid" : "Pay $24");
    setBusy(false);
    busyRef.current = false;
    tlRef.current = null;
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
        <Button
          size="small"
          variant="ghost"
          onClick={() => {
            genRef.current += 1;
            tlRef.current?.kill();
            tlRef.current = null;
            busyRef.current = false;
            setBusy(false);
            setLabel("Pay $24");
            group.set("card", "root", { y: 0, scale: 1 });
            group.set("alert", "root", { y: 0, x: 0 });
          }}
        >
          Kill
        </Button>
      </div>
      <Alert
        status="info"
        title="Order"
        description="Ping at 0, then card saving at +=0.12."
        hoverLift={false}
        motionController={alert}
        motion={{ events: alertEvents }}
      />
      <Card motionController={card} motion={{ events: cardEvents }} className="max-w-xs">
        <Card.Header>
          <Card.Title>Checkout</Card.Title>
          <Card.Description>group.timeline() — GSAP positions, not querySelector.</Card.Description>
        </Card.Header>
        <Card.Footer>
          <Button size="small" motionController={pay} motion={{ events: payEvents }} onClick={() => void run(true)}>
            {label}
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
}
