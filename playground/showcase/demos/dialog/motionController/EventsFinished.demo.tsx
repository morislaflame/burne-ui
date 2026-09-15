import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Dialog } from "@/components/core/Dialog";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "dialog:out": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "dialog:rest": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function DialogMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  async function bounce() {
    setBusy(true);
    try {
      await controller.playSlot("panel", "dialog:out", { waitForComplete: true }).finished;
      await controller.playSlot("panel", "dialog:rest", { waitForComplete: true }).finished;
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
        className="relative min-h-[18rem] overflow-hidden rounded-mid border-2 border-dashed border-primary/40 bg-surface/40 p-large"
      >
      {container ? (
        <Dialog open portalContainer={container} size="small">
          <Dialog.Panel motionController={controller} dismissOnBackdrop={false} motion={{ events }}>
            <Dialog.Header>
              <Dialog.HeadingBlock>
                <Dialog.Title>Title</Dialog.Title>
                <Dialog.Description>Description</Dialog.Description>
              </Dialog.HeadingBlock>
            </Dialog.Header>
            <Dialog.Body>
              <p className="text-sm text-muted">Handle lives on Panel — play() skips.</p>
            </Dialog.Body>
          </Dialog.Panel>
        </Dialog>
      ) : null}
      </div>
    </div>
  );
}
