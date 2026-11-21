import { useState } from "react";

import { Avatar } from "@/components/core/Avatar";
import { Button } from "@/components/core/Button";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "presence:up": { y: -10, scale: 1.08, duration: 0.28, ease: "power2.out", replay: "rest" },
  "presence:down": { y: 0, scale: 1, duration: 0.22, ease: "power2.inOut" },
});

export function AvatarMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);

  async function bounce() {
    setBusy(true);
    try {
      await controller.play("presence:up", { waitForComplete: true }).finished;
      await controller.play("presence:down", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>
        Bounce
      </Button>
      <Avatar size="mid" label="Ada Lovelace" motionController={controller} motion={{ events }} />
    </div>
  );
}
