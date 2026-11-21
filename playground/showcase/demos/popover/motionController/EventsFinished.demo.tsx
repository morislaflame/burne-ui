import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Popover } from "@/components/core/Popover";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "popover:out": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "popover:rest": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function PopoverMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);

  async function bounce() {
    setBusy(true);
    try {
      await controller.playSlot("content", "popover:out", { waitForComplete: true }).finished;
      await controller.playSlot("content", "popover:rest", { waitForComplete: true }).finished;
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
      <Popover open>
        <Popover.Trigger asChild>
          <Button size="small" variant="outline" type="button">
            Open
          </Button>
        </Popover.Trigger>
        <Popover.Content motionController={controller} motion={{ events }}>
          <Popover.Header>
            <Popover.Title>Title</Popover.Title>
            <Popover.Description>Description</Popover.Description>
          </Popover.Header>
          <Popover.Body>Handle lives on Content — play() skips.</Popover.Body>
        </Popover.Content>
      </Popover>
    </div>
  );
}
