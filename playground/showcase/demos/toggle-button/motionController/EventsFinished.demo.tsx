import { useState } from "react";

import { Button } from "@/components/core/Button";
import { ToggleButton } from "@/components/core/ToggleButton";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";
import { IoHeartOutline } from "react-icons/io5";

const events = createMotionEvents({
  "like:out": { y: -10, scale: 1.06, duration: 0.28, ease: "power2.out", replay: "rest" },
  "like:rest": { y: 0, scale: 1, duration: 0.22, ease: "power2.inOut" },
});

export function ToggleButtonMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);

  async function bounce() {
    setBusy(true);
    try {
      await controller.play("like:out", { waitForComplete: true }).finished;
      await controller.play("like:rest", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>
        Bounce
      </Button>
      <ToggleButton
        variant="outline"
        icon={<IoHeartOutline aria-hidden />}
        motionController={controller}
        motion={{ events, root: { pressIn: false } }}
      >
        Like
      </ToggleButton>
    </div>
  );
}
