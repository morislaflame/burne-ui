import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Field } from "@/components/core/Field";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "field:out": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "field:rest": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function FieldMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);

  async function bounce() {
    setBusy(true);
    try {
      await controller.play("field:out", { waitForComplete: true }).finished;
      await controller.play("field:rest", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>
        Bounce
      </Button>
      <Field motionController={controller} motion={{ events }}>
        <Field.Label>Email</Field.Label>
        <Field.Hint>waitForComplete on the trigger, not the Field.</Field.Hint>
      </Field>
    </div>
  );
}
