import { useState } from "react";

import { Badge } from "@/components/core/Badge";
import { Button } from "@/components/core/Button";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "inbox:saving": { y: -4, duration: 0.28, yoyo: true, repeat: -1, ease: "sine.inOut" },
  "inbox:success": {
    y: -8,
    scale: 1.12,
    duration: 0.22,
    ease: "back.out(2)",
    replay: "rest",
  },
  "inbox:error": { x: 5, y: 0, duration: 0.07, yoyo: true, repeat: 5 },
  "inbox:rest": { x: 0, y: 0, scale: 1, duration: 0.2, ease: "power2.out" },
});

function wait(ms: number) {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });
}

export function BadgeMotionEventsCountDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);
  const [count, setCount] = useState(3);

  async function run(ok: boolean) {
    setBusy(true);
    controller.play("inbox:saving");
    await wait(700);
    if (ok) {
      setCount((value) => value + 1);
      controller.play("inbox:success");
      await wait(400);
      controller.play("inbox:rest");
    } else {
      controller.play("inbox:error");
    }
    setBusy(false);
  }

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" disabled={busy} onClick={() => void run(true)}>
          New mail
        </Button>
        <Button size="small" variant="ghost" disabled={busy} onClick={() => void run(false)}>
          Fail
        </Button>
      </div>
      <Badge status="danger" variant="primary" hoverLift={false} motionController={controller} motion={{ events }}>
        {count}
      </Badge>
    </div>
  );
}
