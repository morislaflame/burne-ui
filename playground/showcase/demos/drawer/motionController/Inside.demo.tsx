import { useState } from "react";

import { Drawer } from "@/components/core/Drawer";
import { createMotionEvents, useMotionController } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "drawer:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});
function TitlePulse() {
  const controller = useMotionController();
  return (
    <Drawer.Title onPointerEnter={() => controller.playSlot("title", "drawer:nudge")}>
      Title
    </Drawer.Title>
  );
}

export function DrawerMotionControllerInsideDemo() {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <div className="flex min-h-[22rem] w-full max-w-lg flex-col gap-2xlarge">
      <div
        ref={setContainer}
        className="relative min-h-[18rem] overflow-hidden rounded-large border-2 border-dashed border-primary/40 bg-surface/40 p-large"
      >
      {container ? (
        <Drawer open portalContainer={container} placement="right" size="small">
          <Drawer.Panel motion={{ events }}>
            <Drawer.Header>
              <Drawer.HeadingBlock>
                <TitlePulse />
                <Drawer.Description>Hover the title.</Drawer.Description>
              </Drawer.HeadingBlock>
            </Drawer.Header>
            <Drawer.Body>
              <p className="text-sm text-muted">useMotionController() inside the panel tree.</p>
            </Drawer.Body>
          </Drawer.Panel>
        </Drawer>
      ) : null}
      </div>
    </div>
  );
}
