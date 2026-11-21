import { useState } from "react";

import { Button } from "@/components/core/Button";
import { TagsInput } from "@/components/core/TagsInput";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "tag:up": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "tag:down": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function TagsInputMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);

  async function bounce() {
    setBusy(true);
    try {
      await controller.playSlot("tag", "tag:up", { waitForComplete: true }).finished;
      await controller.playSlot("tag", "tag:down", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex w-full max-w-xs flex-col gap-2xlarge">
      <Button size="small" variant="outline" type="button" disabled={busy} onClick={() => void bounce()}>
        Bounce
      </Button>
      <TagsInput
        label="Topics"
        defaultValues={["design", "react"]}
        placeholder="Add a tag"
        motionController={controller}
        motion={{ events }}
      />
    </div>
  );
}
