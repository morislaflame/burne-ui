import { useState } from "react";

import { RadioGroup } from "@/components/composite/RadioGroup";
import { Button } from "@/components/core/Button";
import { Radio } from "@/components/core/Radio";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";
import { Label } from "@/components/core/Label";

const events = createMotionEvents({
  "choice:out": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "choice:rest": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function RadioGroupMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);

  async function bounce() {
    setBusy(true);
    try {
      await controller.play("choice:out", { waitForComplete: true }).finished;
      await controller.play("choice:rest", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>
        Bounce
      </Button>
      <RadioGroup aria-label="Shipping" motionController={controller} motion={{ events }}>
        <RadioGroup.Legend>
          <Label>Shipping</Label>
          <RadioGroup.Hint>waitForComplete on the trigger, not the group.</RadioGroup.Hint>
        </RadioGroup.Legend>
        <RadioGroup.List>
          <Radio value="ground" label="Ground" />
          <Radio value="air" label="Air" />
        </RadioGroup.List>
      </RadioGroup>
    </div>
  );
}
