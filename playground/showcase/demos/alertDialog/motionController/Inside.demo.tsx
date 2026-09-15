import { useState } from "react";

import { AlertDialog } from "@/components/composite/AlertDialog";
import { createMotionEvents, useMotionController } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "alert:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
function TitlePulse() {
  const controller = useMotionController();
  return (
    <AlertDialog.Title onPointerEnter={() => controller.playSlot("title", "alert:nudge")}>
      Title
    </AlertDialog.Title>
  );
}

export function AlertDialogMotionControllerInsideDemo() {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <div className="flex min-h-[22rem] w-full max-w-lg flex-col gap-2xlarge">
      <div
        ref={setContainer}
        className="relative min-h-[18rem] overflow-hidden rounded-mid border-2 border-dashed border-primary/40 bg-surface/40 p-large"
      >
      {container ? (
        <AlertDialog open portalContainer={container} size="small" status="warning">
          <AlertDialog.Panel motion={{ events }}>
            <AlertDialog.Header>
              <AlertDialog.HeadingBlock>
                <TitlePulse />
                <AlertDialog.Description>Hover the title.</AlertDialog.Description>
              </AlertDialog.HeadingBlock>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p className="text-sm text-muted">useMotionController() inside the panel tree.</p>
            </AlertDialog.Body>
          </AlertDialog.Panel>
        </AlertDialog>
      ) : null}
      </div>
    </div>
  );
}
