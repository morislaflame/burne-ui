import { useState } from "react";

import { Button } from "@/components/core/Button";
import { AlertDialog } from "@/components/composite/AlertDialog";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "alert:kick": (ctx) => {
    const tl = ctx.timeline();
    tl.fromRest(ctx.el, { y: -6, duration: 0.16, ease: "power2.out" }, 0);
    if (ctx.targets.title) {
      tl.fromRest(ctx.targets.title, { y: -8, duration: 0.18 }, 0);
    }
    if (ctx.targets.description) {
      tl.fromRest(ctx.targets.description, { y: -10, duration: 0.18 }, 0.04);
    }
    tl.to(ctx.el, { y: 0, duration: 0.24, ease: "power2.inOut" }, 0.22);
    if (ctx.targets.title) {
      tl.to(ctx.targets.title, { y: 0, duration: 0.22 }, 0.22);
    }
    if (ctx.targets.description) {
      tl.to(ctx.targets.description, { y: 0, duration: 0.22 }, 0.22);
    }
    return tl;
  },
});

export function AlertDialogMotionEventsKickDemo() {
  const controller = useMotionControllerHandle();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <div className="flex min-h-[22rem] w-full max-w-lg flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("panel", "alert:kick")}>
          Kick
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
