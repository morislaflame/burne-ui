import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Form } from "@/components/composite/Form";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "form:out": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "form:rest": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function FormMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);

  async function bounce() {
    setBusy(true);
    try {
      await controller.play("form:out", { waitForComplete: true }).finished;
      await controller.play("form:rest", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>
        Bounce
      </Button>
      <Form aria-label="waitForComplete" motionController={controller} motion={{ events }}>
        <Form.Header>
          <Form.Title>Profile</Form.Title>
          <Form.Description>waitForComplete on the trigger, not the Form.</Form.Description>
        </Form.Header>
      </Form>
    </div>
  );
}
