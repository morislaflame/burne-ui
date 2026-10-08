import { useState } from "react";

import { Button } from "@/components/core/Button";
import { ContextMenu } from "@/components/core/ContextMenu";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "menu:out": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "menu:rest": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

const surface =
  "min-h-control-mid items-center justify-center rounded-mid border-token bg-surface px-large text-foreground";

export function ContextMenuMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);

  async function bounce() {
    setBusy(true);
    try {
      await controller.playSlot("content", "menu:out", { waitForComplete: true }).finished;
      await controller.playSlot("content", "menu:rest", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-[22rem] w-full max-w-lg flex-col gap-2xlarge">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>
        Bounce
      </Button>
      <ContextMenu open>
        <ContextMenu.Trigger className={surface}>Menu</ContextMenu.Trigger>
        <ContextMenu.Content motionController={controller} motion={{ events }}>
          <ContextMenu.Item>Alpha</ContextMenu.Item>
          <ContextMenu.Item>Beta</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>
    </div>
  );
}
