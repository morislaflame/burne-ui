import { useState } from "react";

import { Alert } from "@/components/core/Alert";
import { Button } from "@/components/core/Button";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "save:saving": { y: -3, duration: 0.28, yoyo: true, repeat: -1, ease: "sine.inOut" },
  "save:success": (ctx) => {
    const tl = ctx.timeline();
    tl.to(ctx.el, { y: 0, duration: 0.22, ease: "power2.out" }, 0);
    if (ctx.targets.title) {
      tl.add(tweenCssColor(ctx.targets.title, "var(--color-success)", { duration: 0.28 }), 0);
    }
    return tl;
  },
  "save:error": (ctx) => {
    const tl = ctx.timeline();
    tl.fromRest(ctx.el, { x: 5, y: 0, duration: 0.07, yoyo: true, repeat: 5 }, 0);
    if (ctx.targets.title) {
      tl.add(tweenCssColor(ctx.targets.title, "var(--color-danger)", { duration: 0.2 }), 0);
    }
    return tl;
  },
});

function wait(ms: number) {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });
}

export function AlertMotionEventsSaveDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);

  async function run(ok: boolean) {
    setBusy(true);
    controller.play("save:saving");
    await wait(800);
    controller.play(ok ? "save:success" : "save:error");
    setBusy(false);
  }

  return (
    <div className="flex w-full flex-col gap-large">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" disabled={busy} onClick={() => void run(true)}>
          Save
        </Button>
        <Button size="small" variant="ghost" disabled={busy} onClick={() => void run(false)}>
          Fail
        </Button>
      </div>
      <Alert
        status="default"
        title="Draft"
        description="saving → success / error from an async flow."
        hoverLift={false}
        motionController={controller}
        motion={{ events }}
      />
    </div>
  );
}
