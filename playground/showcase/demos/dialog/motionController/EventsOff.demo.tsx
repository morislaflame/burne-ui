import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Dialog } from "@/components/core/Dialog";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({
  "dialog:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "dialog:nudge": false });

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
  );
}

export function DialogMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();
  const [liveHost, setLiveHost] = useState<HTMLDivElement | null>(null);
  const [offHost, setOffHost] = useState<HTMLDivElement | null>(null);

  return (
    <div className="flex min-h-[22rem] w-full max-w-lg flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.playSlot("panel", "dialog:nudge")}>
          Live nudge
        </Button>
        <Button size="small" variant="ghost" onClick={() => offController.playSlot("panel", "dialog:nudge")}>
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
