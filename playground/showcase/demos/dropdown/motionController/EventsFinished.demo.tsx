import { useState } from "react";
import { Button } from "@/components/core/Button";
import { Dropdown } from "@/components/core/Dropdown";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "dropdown:out": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "dropdown:rest": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function DropdownMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);
  async function bounce() {
    setBusy(true);
    try {
      await controller.playSlot("content", "dropdown:out", { waitForComplete: true }).finished;
      await controller.playSlot("content", "dropdown:rest", { waitForComplete: true }).finished;
    } finally { setBusy(false); }
  }
  return (
    <div className="flex min-h-[22rem] w-full max-w-lg flex-col gap-2xlarge">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>Bounce</Button>
      <Dropdown open>
        <Dropdown.Trigger asChild>
          <Button size="small" variant="outline" type="button">Menu</Button>
        </Dropdown.Trigger>
        <Dropdown.Popover motionController={controller} motion={{ events }}>
          <Dropdown.Item>Alpha</Dropdown.Item>
          <Dropdown.Item>Beta</Dropdown.Item>
        </Dropdown.Popover>
      </Dropdown>
    </div>
  );
}
