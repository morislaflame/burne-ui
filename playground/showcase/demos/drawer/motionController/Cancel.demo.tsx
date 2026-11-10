import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Drawer } from "@/components/core/Drawer";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "drawer:pulse": (ctx) =>
    ctx.fromRest({
      y: -4,
      duration: 0.35,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    }),
});

export function DrawerMotionControllerCancelDemo() {
  const controller = useMotionControllerHandle();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <div className="flex min-h-[22rem] w-full max-w-lg flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("panel", "drawer:pulse")}>
          Loop
        </Button>
        <Button
          size="small"
          variant="ghost"
          onClick={() => {
            controller.cancel("panel");
            controller.set("panel", { y: 0 });
          }}
        >
          Cancel
        </Button>
      </div>
      <div
        ref={setContainer}
        className="relative min-h-[18rem] overflow-hidden rounded-large border-2 border-dashed border-primary/40 bg-surface/40 p-large"
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
