import { useState } from "react";

import { Button } from "@/components/core/Button";
import { HoverCard } from "@/components/core/HoverCard";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

import { HoverCardPersonBody, HoverCardPersonTrigger } from "../profile";

const events = createMotionEvents({
  "card:up": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "card:down": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function HoverCardMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);

  async function bounce() {
    setBusy(true);
    try {
      await controller.playSlot("title", "card:up", { waitForComplete: true }).finished;
      await controller.playSlot("title", "card:down", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2xlarge">
      <Button size="small" variant="outline" type="button" disabled={busy} onClick={() => void bounce()}>
        Bounce
      </Button>
      <HoverCard
        defaultOpen
        trigger={<HoverCardPersonTrigger />}
        title="Ada Lovelace"
        description="Mathematician"
        classNames={{ content: "w-64" }}
        motionController={controller}
        motion={{ events }}
      >
        <HoverCardPersonBody />
      </HoverCard>
    </div>
  );
}
