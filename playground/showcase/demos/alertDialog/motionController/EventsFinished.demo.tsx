import { useState } from "react";

import { Button } from "@/components/core/Button";
import { AlertDialog } from "@/components/composite/AlertDialog";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "alert:out": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "alert:rest": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function AlertDialogMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  async function bounce() {
    setBusy(true);
    try {
      await controller.playSlot("panel", "alert:out", { waitForComplete: true }).finished;
      await controller.playSlot("panel", "alert:rest", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-[22rem] w-full max-w-lg flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>
          Bounce
        </Button>
      </div>
      <div
        ref={setContainer}
        className="relative min-h-[18rem] overflow-hidden rounded-large border-2 border-dashed border-primary/40 bg-surface/40 p-large"
      >
      {container ? (
        <AlertDialog open portalContainer={container} size="small" status="warning">
          <AlertDialog.Panel motionController={controller} motion={{ events }}>
            <AlertDialog.Header>
              <AlertDialog.HeadingBlock>
                <AlertDialog.Title>Title</AlertDialog.Title>
                <AlertDialog.Description>Description</AlertDialog.Description>
              </AlertDialog.HeadingBlock>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p className="text-sm text-muted">Handle lives on Panel — play() skips.</p>
            </AlertDialog.Body>
          </AlertDialog.Panel>
        </AlertDialog>
      ) : null}
      </div>
    </div>
  );
}
