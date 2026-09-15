import { useState } from "react";

import { Button } from "@/components/core/Button";
import { AlertDialog } from "@/components/composite/AlertDialog";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({
  "alert:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "alert:nudge": false });

function Host({
  container,
  setContainer,
  controller,
  events,
}: {
  container: HTMLDivElement | null;
  setContainer: (node: HTMLDivElement | null) => void;
  controller: ReturnType<typeof useMotionControllerHandle>;
  events: typeof live | typeof off;
}) {
  return (
    <div
      ref={setContainer}
      className="relative min-h-[12rem] overflow-hidden rounded-mid border-2 border-dashed border-primary/40 bg-surface/40 p-large"
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
  );
}

export function AlertDialogMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();
  const [liveHost, setLiveHost] = useState<HTMLDivElement | null>(null);
  const [offHost, setOffHost] = useState<HTMLDivElement | null>(null);

  return (
    <div className="flex min-h-[22rem] w-full max-w-lg flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.playSlot("panel", "alert:nudge")}>
          Live nudge
        </Button>
        <Button size="small" variant="ghost" onClick={() => offController.playSlot("panel", "alert:nudge")}>
          Off nudge
        </Button>
      </div>
      <div className="flex flex-col gap-large">
        <Host container={liveHost} setContainer={setLiveHost} controller={liveController} events={live} />
        <Host container={offHost} setContainer={setOffHost} controller={offController} events={off} />
      </div>
    </div>
  );
}
