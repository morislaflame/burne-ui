import { useState } from "react";

import { Button } from "@/components/core/Button";
import { ScrollArea } from "@/components/core/ScrollArea";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

import { ScrollAreaCityList } from "../cities";

const events = createMotionEvents({
  "scroll:up": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "scroll:down": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function ScrollAreaMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);

  async function bounce() {
    setBusy(true);
    try {
      await controller.playSlot("thumb", "scroll:up", { waitForComplete: true }).finished;
      await controller.playSlot("thumb", "scroll:down", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>
        Bounce
      </Button>
      <ScrollArea
        aria-label="Cities"
        visibility="always"
        className="h-48 w-64"
        motionController={controller}
        motion={{ events }}
      >
        <ScrollAreaCityList />
      </ScrollArea>
    </div>
  );
}
