import { useState } from "react";

import { Button } from "@/components/core/Button";
import { createMotionStates } from "@/components/core/utils/slotMotion";

type SaveMode = "idle" | "loading" | "success" | "error";

const show = { autoAlpha: 1, scale: 1, duration: 0.2 } as const;
const hideLabel = { autoAlpha: 0, scale: 0.92, duration: 0.2 } as const;
const hideLayer = { autoAlpha: 0, scale: 0.85, duration: 0.2 } as const;

const states = createMotionStates({
  idle: {
    label: show,
    loader: hideLayer,
    success: hideLayer,
    error: hideLayer,
  },
  loading: {
    label: hideLabel,
    loader: show,
    success: hideLayer,
    error: hideLayer,
  },
  success: {
    label: hideLabel,
    loader: hideLayer,
    success: show,
    error: hideLayer,
  },
  error: {
    label: hideLabel,
    loader: hideLayer,
    success: hideLayer,
    error: show,
  },
});

function wait(ms: number) {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, ms);
  });
}

export function ButtonMotionStateSaveDemo() {
  const [mode, setMode] = useState<SaveMode>("idle");
  const busy = mode !== "idle";

  async function run(ok: boolean) {
    if (mode !== "idle") return;
    setMode("loading");
    await wait(1400);
    setMode(ok ? "success" : "error");
    await wait(2000);
    setMode("idle");
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
        variant="primary"
        disabled={busy}
        aria-busy={mode === "loading"}
        motionState={mode}
        motion={{ states, root: { pressIn: false } }}
        onClick={() => void run(true)}
      >
        <Button.Label>Save</Button.Label>
        <Button.Loader />
        <Button.Success />
        <Button.Error />
      </Button>
    </div>
  );
}
