import { useState } from "react";

import { Button } from "@/components/core/Button";
import { SearchInput } from "@/components/core/SearchInput";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "search:out": { y: -10, scale: 1.03, duration: 0.28, ease: "power2.out", replay: "rest" },
  "search:rest": { y: 0, scale: 1, duration: 0.22, ease: "power2.inOut" },
});

export function SearchInputMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);

  async function bounce() {
    setBusy(true);
    try {
      await controller.play("search:out", { waitForComplete: true }).finished;
      await controller.play("search:rest", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>
        Bounce
      </Button>
      <SearchInput
        aria-label="Search"
        placeholder="Search…"
        defaultExpanded
        collapseOnBlur={false}
        motionController={controller}
        motion={{ events }}
      />
    </div>
  );
}
