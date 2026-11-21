import { useState } from "react";

import { ListBox } from "@/components/core/ListBox";
import { Button } from "@/components/core/Button";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "listbox:out": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "listbox:rest": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function ListBoxMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);

  async function bounce() {
    setBusy(true);
    try {
      await controller.playSlot("header", "listbox:out", { waitForComplete: true }).finished;
      await controller.playSlot("header", "listbox:rest", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>
        Bounce
      </Button>
      <ListBox
        aria-label="Lang"
        motionController={controller}
        motion={{
          item: { pressIn: false, pressOut: false },
          events,
        }}
      >
        <ListBox.Section>
          <ListBox.Header>Alpha</ListBox.Header>
          <ListBox.Item value="ada" label="Ada" />
          <ListBox.Separator />
          <ListBox.Item value="lin" label="Lin" />
        </ListBox.Section>
        <ListBox.Section>
          <ListBox.Header>Beta</ListBox.Header>
          <ListBox.Item value="sam" label="Sam" />
        </ListBox.Section>
      </ListBox>
    </div>
  );
}
