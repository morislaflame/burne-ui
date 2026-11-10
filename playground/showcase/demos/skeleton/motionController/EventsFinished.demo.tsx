import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Skeleton } from "@/components/core/Skeleton";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "skel:out": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "skel:rest": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function SkeletonMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);

  async function bounce() {
    setBusy(true);
    try {
      await controller.play("skel:out", { waitForComplete: true }).finished;
      await controller.play("skel:rest", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>
        Bounce
      </Button>
      <Skeleton className="h-8 w-full" motionController={controller} motion={{ events }} />
    </div>
  );
}
