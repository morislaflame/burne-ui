import { useState } from "react";

import { Button } from "@/components/core/Button";
import { ComboBox } from "@/components/core/ComboBox";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const options = [
  { value: "react", label: "React" },
  { value: "svelte", label: "Svelte" },
  { value: "vue", label: "Vue" },
];

const events = createMotionEvents({
  "combo:out": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "combo:rest": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function ComboBoxMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);

  async function bounce() {
    setBusy(true);
    try {
      await controller.playSlot("inputGroup", "combo:out", { waitForComplete: true }).finished;
      await controller.playSlot("inputGroup", "combo:rest", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex max-w-sm flex-col gap-2xlarge">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>
        Bounce
      </Button>
      <ComboBox
        label="Framework"
        options={options}
        defaultValue="react"
        motionController={controller}
        motion={{ events }}
      />
    </div>
  );
}
