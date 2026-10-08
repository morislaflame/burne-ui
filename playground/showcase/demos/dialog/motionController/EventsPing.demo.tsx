import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Dialog } from "@/components/core/Dialog";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "dialog:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function DialogMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <div className="flex min-h-[22rem] w-full max-w-lg flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("panel", "dialog:nudge")}>
          Nudge
        </Button>
      </div>
      <div
        ref={setContainer}
        className="relative min-h-[18rem] overflow-hidden rounded-large border-2 border-dashed border-primary/40 bg-surface/40 p-large"
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
