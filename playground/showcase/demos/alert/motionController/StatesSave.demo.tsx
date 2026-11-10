import { useState } from "react";

import { Alert } from "@/components/core/Alert";
import { Button } from "@/components/core/Button";
import { createMotionFactory, createMotionStates, type MotionPayload } from "@/components/core/utils/slotMotion";

type SaveMode = "idle" | "loading" | "success" | "error";

type SavePayload = MotionPayload & {
  attempt: number;
};

const errorShake = createMotionFactory<SavePayload>((ctx) => {
  const attempt = ctx.payload?.attempt ?? 1;
  return ctx.fromRest({
    x: attempt > 1 ? 8 : 5,
    y: 0,
    autoAlpha: 1,
    duration: 0.07,
    yoyo: true,
    repeat: 5,
  });
});

const states = createMotionStates({
  idle: {
    root: { y: 0, autoAlpha: 1, duration: 0.22 },
    title: { y: 0, duration: 0.22 },
  },
  loading: {
    root: { y: -3, autoAlpha: 0.72, duration: 0.28, yoyo: true, repeat: -1, ease: "sine.inOut" },
    title: { y: 2, duration: 0.28 },
  },
  success: {
    root: { y: 0, autoAlpha: 1, duration: 0.28, ease: "power2.out" },
    title: { y: 0, duration: 0.22 },
  },
  error: {
    root: errorShake,
    title: { y: 0, duration: 0.2 },
  },
});

function wait(ms: number) {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });
}

const COPY: Record<SaveMode, { title: string; description: string; status: "default" | "success" | "danger" | "info" }> = {
  idle: { title: "Draft", description: "idle — same state again is silent.", status: "info" },
  loading: { title: "Saving…", description: "loading loops until the mode changes.", status: "default" },
  success: { title: "Saved", description: "success. Click Saved again: no replay.", status: "success" },
  error: { title: "Could not save", description: "error shake on enter, not on a repeat.", status: "danger" },
};

export function AlertMotionStatesSaveDemo() {
  const [mode, setMode] = useState<SaveMode>("idle");
  const [attempt, setAttempt] = useState(0);
  const copy = COPY[mode];

  async function run(ok: boolean) {
    setMode("loading");
    await wait(800);
    if (ok) {
      setMode("success");
      return;
    }
    setAttempt((n) => n + 1);
    setMode("error");
  }

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" disabled={mode === "loading"} onClick={() => void run(true)}>
          Save
        </Button>
        <Button size="small" variant="ghost" disabled={mode === "loading"} onClick={() => void run(false)}>
          Fail
        </Button>
        <Button size="small" variant="ghost" disabled={mode !== "success"} onClick={() => setMode("success")}>
          Stay success
        </Button>
      </div>
      <Alert
        status={copy.status}
        title={copy.title}
        description={copy.description}
        hoverLift={false}
        motionState={mode}
        motionPayload={{ attempt }}
        motion={{ states }}
      />
    </div>
  );
}
