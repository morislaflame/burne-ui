import { useState } from "react";

import { Dialog } from "@/components/core/Dialog";
import { createMotionEvents, useMotionController } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "dialog:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
function TitlePulse() {
  const controller = useMotionController();
  return (
    <Dialog.Title onPointerEnter={() => controller.playSlot("title", "dialog:nudge")}>
      Title
    </Dialog.Title>
  );
}

export function DialogMotionControllerInsideDemo() {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <div className="flex min-h-[22rem] w-full max-w-lg flex-col gap-2xlarge">
      <div
        ref={setContainer}
        className="relative min-h-[18rem] overflow-hidden rounded-large border-2 border-dashed border-primary/40 bg-surface/40 p-large"
      >
      {container ? (
        <Dialog open portalContainer={container} size="small">
          <Dialog.Panel dismissOnBackdrop={false} motion={{ events }}>
            <Dialog.Header>
              <Dialog.HeadingBlock>
                <TitlePulse />
                <Dialog.Description>Hover the title.</Dialog.Description>
              </Dialog.HeadingBlock>
            </Dialog.Header>
            <Dialog.Body>
              <p className="text-sm text-muted">useMotionController() inside the panel tree.</p>
            </Dialog.Body>
          </Dialog.Panel>
        </Dialog>
      ) : null}
      </div>
    </div>
  );
}
