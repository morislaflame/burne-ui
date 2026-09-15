import { useState } from "react";

import { IoSaveOutline } from "react-icons/io5";

import { Button } from "@/components/core/Button";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "cta:saving": { y: -3, duration: 0.28, yoyo: true, repeat: -1, ease: "sine.inOut" },
  "cta:success": (ctx) => {
    const tl = ctx.timeline();
    tl.to(ctx.el, { y: 0, duration: 0.2, ease: "power2.out" }, 0);
    if (ctx.targets.icon) {
      tl.fromRest(ctx.targets.icon, { rotation: -16, scale: 1.16, duration: 0.32, ease: "back.out(1.8)" }, 0);
    }
    if (ctx.targets.text) {
      tl.add(tweenCssColor(ctx.targets.text, "var(--color-success)", { duration: 0.28 }), 0);
    }
    return tl;
  },
  "cta:error": (ctx) => {
    const tl = ctx.timeline();
    tl.fromRest(ctx.el, { x: 5, y: 0, duration: 0.07, yoyo: true, repeat: 5 }, 0);
    if (ctx.targets.text) {
      tl.add(tweenCssColor(ctx.targets.text, "var(--color-danger)", { duration: 0.2 }), 0);
    }
    return tl;
  },
});

function wait(ms: number) {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });
}

export function ButtonMotionEventsSaveDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);
  const [label, setLabel] = useState("Save draft");

  async function run(ok: boolean) {
    setBusy(true);
    setLabel("Saving…");
    controller.play("cta:saving");
    await wait(800);
    controller.play(ok ? "cta:success" : "cta:error");
    setLabel(ok ? "Saved" : "Save draft");
    setBusy(false);
  }

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" disabled={busy} onClick={() => void run(true)}>
          Save
        </Button>
        <Button size="small" variant="ghost" disabled={busy} onClick={() => void run(false)}>
          Fail
        </Button>
      </div>
      <Button
        variant="outline"
        icon={<IoSaveOutline aria-hidden />}
        motionController={controller}
        motion={{ events, root: { pressIn: false } }}
        onClick={() => void run(true)}
      >
        {label}
      </Button>
    </div>
  );
}
