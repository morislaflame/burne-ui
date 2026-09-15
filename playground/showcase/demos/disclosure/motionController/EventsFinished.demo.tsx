import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Disclosure } from "@/components/core/Disclosure";
import { Text } from "@/components/core/Text";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "disclosure:out": { y: -8, duration: 0.28, ease: "power2.out", replay: "rest" },
  "disclosure:rest": { y: 0, duration: 0.22, ease: "power2.inOut" },
});

export function DisclosureMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);

  async function bounce() {
    setBusy(true);
    try {
      await controller.playSlot("titleLift", "disclosure:out", { waitForComplete: true }).finished;
      await controller.playSlot("titleLift", "disclosure:rest", { waitForComplete: true }).finished;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>
        Bounce
      </Button>
      <Disclosure motionController={controller} motion={{ events }}>
        <Disclosure.Trigger>waitForComplete</Disclosure.Trigger>
        <Disclosure.Content>
          <Text as="p" variant="small" className="text-muted">Disabled only on the trigger button.</Text>
        </Disclosure.Content>
      </Disclosure>
    </div>
  );
}
