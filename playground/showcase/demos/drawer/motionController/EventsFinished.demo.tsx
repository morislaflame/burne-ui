import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Drawer } from "@/components/core/Drawer";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "drawer:out": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "drawer:rest": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function DrawerMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  async function bounce() {
    setBusy(true);
    try {
      await controller.playSlot("panel", "drawer:out", { waitForComplete: true }).finished;
      await controller.playSlot("panel", "drawer:rest", { waitForComplete: true }).finished;
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
        <Drawer open portalContainer={container} placement="right" size="small">
          <Drawer.Panel motionController={controller} motion={{ events }}>
            <Drawer.Header>
              <Drawer.HeadingBlock>
                <Drawer.Title>Title</Drawer.Title>
                <Drawer.Description>Description</Drawer.Description>
              </Drawer.HeadingBlock>
            </Drawer.Header>
            <Drawer.Body>
              <p className="text-sm text-muted">Handle lives on Panel — play() skips.</p>
            </Drawer.Body>
          </Drawer.Panel>
        </Drawer>
      ) : null}
      </div>
    </div>
  );
}
