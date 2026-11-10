import { useState } from "react";

import { ButtonGroup } from "@/components/composite/ButtonGroup";
import { Button } from "@/components/core/Button";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "toolbar:out": { y: -10, scale: 1.03, duration: 0.28, ease: "power2.out", replay: "rest" },
  "toolbar:rest": { y: 0, scale: 1, duration: 0.22, ease: "power2.inOut" },
});

export function ButtonGroupMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);

  async function bounce() {
    setBusy(true);
    try {
      await controller.play("toolbar:out", { waitForComplete: true }).finished;
      await controller.play("toolbar:rest", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>
        Bounce
      </Button>
      <ButtonGroup aria-label="Edit" motionController={controller} motion={{ events }}>
        <ButtonGroup.Text>Edit</ButtonGroup.Text>
        <Button>Cut</Button>
        <Button>Copy</Button>
      </ButtonGroup>
    </div>
  );
}
