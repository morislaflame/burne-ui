import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Link } from "@/components/core/Link";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

import { preventNav } from "../../../shared/utils";

const events = createMotionEvents({
  "nav:out": { y: -10, scale: 1.06, duration: 0.28, ease: "power2.out", replay: "rest" },
  "nav:rest": { y: 0, scale: 1, duration: 0.22, ease: "power2.inOut" },
});

export function LinkMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);

  async function bounce() {
    setBusy(true);
    try {
      await controller.play("nav:out", { waitForComplete: true }).finished;
      await controller.play("nav:rest", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>
        Bounce
      </Button>
      <Link
        href="#"
        onClick={preventNav}
        underline
        motionController={controller}
        motion={{ events, root: { pressIn: false } }}
      >
        run.finished
      </Link>
    </div>
  );
}
