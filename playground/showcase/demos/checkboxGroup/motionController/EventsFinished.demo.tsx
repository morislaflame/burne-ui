import { useState } from "react";

import { CheckboxGroup } from "@/components/composite/CheckboxGroup";
import { Button } from "@/components/core/Button";
import { Checkbox } from "@/components/core/Checkbox";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "checks:out": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "checks:rest": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function CheckboxGroupMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);

  async function bounce() {
    setBusy(true);
    try {
      await controller.play("checks:out", { waitForComplete: true }).finished;
      await controller.play("checks:rest", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>
        Bounce
      </Button>
      <CheckboxGroup motionController={controller} motion={{ events }}>
        <CheckboxGroup.Legend>
          <CheckboxGroup.Label>Plan</CheckboxGroup.Label>
          <CheckboxGroup.Hint>waitForComplete on the trigger, not the group.</CheckboxGroup.Hint>
        </CheckboxGroup.Legend>
        <CheckboxGroup.List>
          <Checkbox value="pro" label="Pro" />
          <Checkbox value="team" label="Team" />
        </CheckboxGroup.List>
      </CheckboxGroup>
    </div>
  );
}
