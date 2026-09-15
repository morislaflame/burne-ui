import { useState } from "react";

import { ToggleButtonGroup } from "@/components/composite/ToggleButtonGroup";
import { Button } from "@/components/core/Button";
import { ToggleButton } from "@/components/core/ToggleButton";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "group:out": { y: -10, scale: 1.03, duration: 0.28, ease: "power2.out", replay: "rest" },
  "group:rest": { y: 0, scale: 1, duration: 0.22, ease: "power2.inOut" },
});

export function ToggleButtonGroupMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);

  async function bounce() {
    setBusy(true);
    try {
      await controller.play("group:out", { waitForComplete: true }).finished;
      await controller.play("group:rest", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>
        Bounce
      </Button>
      <ToggleButtonGroup
        type="single"
        defaultValue="list"
        aria-label="View"
        motionController={controller}
        motion={{ events }}
      >
        <ToggleButton value="list">List</ToggleButton>
        <ToggleButton value="grid">Grid</ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}
