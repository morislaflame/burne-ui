import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Tooltip } from "@/components/core/Tooltip";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "tooltip:out": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "tooltip:rest": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function TooltipMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);

  async function bounce() {
    setBusy(true);
    try {
      await controller.playSlot("content", "tooltip:out", { waitForComplete: true }).finished;
      await controller.playSlot("content", "tooltip:rest", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-[22rem] w-full max-w-lg flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>
          Bounce
        </Button>
      </div>
      <Tooltip open delayShowMs={0}>
        <Tooltip.Trigger>
          <Button size="small" variant="outline" type="button">
            Trigger
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content motionController={controller} motion={{ events }}>
          <Tooltip.Title>Title</Tooltip.Title>
          <Tooltip.Description>Handle lives on Content — play() skips.</Tooltip.Description>
        </Tooltip.Content>
      </Tooltip>
    </div>
  );
}
