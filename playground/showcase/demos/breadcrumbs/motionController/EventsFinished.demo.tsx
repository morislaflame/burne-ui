import { useState } from "react";

import { Breadcrumbs } from "@/components/core/Breadcrumbs";
import { Button } from "@/components/core/Button";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

function preventNav(event: { preventDefault(): void }) {
  event.preventDefault();
}

const events = createMotionEvents({
  "breadcrumbs:out": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "breadcrumbs:rest": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function BreadcrumbsMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);

  async function bounce() {
    setBusy(true);
    try {
      await controller.playSlot("list", "breadcrumbs:out", { waitForComplete: true }).finished;
      await controller.playSlot("list", "breadcrumbs:rest", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>
        Bounce
      </Button>
      <Breadcrumbs
        collapse={false}
        motionController={controller}
        motion={{
          itemLink: { pressIn: false, pressOut: false },
          events,
        }}
      >
        <Breadcrumbs.List>
          <Breadcrumbs.Item href="#" onClick={preventNav}>
            Home
          </Breadcrumbs.Item>
          <Breadcrumbs.Item href="#" onClick={preventNav}>
            Catalog
          </Breadcrumbs.Item>
          <Breadcrumbs.Item current>Page</Breadcrumbs.Item>
        </Breadcrumbs.List>
      </Breadcrumbs>
    </div>
  );
}
