import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Drawer } from "@/components/core/Drawer";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({
  "drawer:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
const off = createMotionEvents({ "drawer:nudge": false });

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
      className="relative min-h-[12rem] overflow-hidden rounded-large border-2 border-dashed border-primary/40 bg-surface/40 p-large"
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
  );
}

export function DrawerMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();
  const [liveHost, setLiveHost] = useState<HTMLDivElement | null>(null);
  const [offHost, setOffHost] = useState<HTMLDivElement | null>(null);

  return (
    <div className="flex min-h-[22rem] w-full max-w-lg flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.playSlot("panel", "drawer:nudge")}>
          Live nudge
        </Button>
        <Button size="small" variant="ghost" onClick={() => offController.playSlot("panel", "drawer:nudge")}>
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
