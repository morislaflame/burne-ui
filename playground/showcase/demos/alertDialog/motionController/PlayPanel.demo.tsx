import { useState } from "react";

import { Button } from "@/components/core/Button";
import { AlertDialog } from "@/components/composite/AlertDialog";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function AlertDialogMotionControllerDemo() {
  const controller = useMotionControllerHandle();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <div className="flex min-h-[22rem] w-full max-w-lg flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("panel", "hoverIn")}>
          playSlot(panel)
        </Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("panel", "hoverOut")}>
          Reset
        </Button>
        <Button size="small" variant="ghost" onClick={() => controller.set("panel", { y: 0 })}>
          Snap
        </Button>
      </div>
      <div
        ref={setContainer}
        className="relative min-h-[18rem] overflow-hidden rounded-large border-2 border-dashed border-primary/40 bg-surface/40 p-large"
      >
      {container ? (
        <AlertDialog open portalContainer={container} size="small" status="warning">
          <AlertDialog.Panel motionController={controller} motion={{
          panel: {
            hoverIn: { y: -6, duration: 0.28, replay: "rest" },
            hoverOut: { y: 0, duration: 0.2 },
          },
        }}>
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
