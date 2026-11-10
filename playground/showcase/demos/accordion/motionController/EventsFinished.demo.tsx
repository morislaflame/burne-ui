import { useState } from "react";
import { Button } from "@/components/core/Button";
import { Accordion } from "@/components/composite/Accordion";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "accordion:out": { x: 10, duration: 0.28, ease: "power2.out", replay: "rest" },
  "accordion:rest": { x: 0, duration: 0.22, ease: "power2.inOut" },
});

export function AccordionMotionEventsFinishedDemo() {
  const controller = useMotionControllerHandle();
  const [busy, setBusy] = useState(false);
  async function bounce() {
    setBusy(true);
    try {
      await controller.playSlot("title", "accordion:out", { waitForComplete: true }).finished;
      await controller.playSlot("title", "accordion:rest", { waitForComplete: true }).finished;
    } finally { setBusy(false); }
  }
  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" disabled={busy} onClick={() => void bounce()}>Bounce</Button>
      <Accordion className="max-w-lg">
        <Accordion.Item value="a" motionController={controller} motion={{ events }}>
        <Accordion.Heading>
          <Accordion.Trigger>
            <Accordion.Message>
              <Accordion.Content>
                <Accordion.Title>Title slot</Accordion.Title>
                <Accordion.Description>Description</Accordion.Description>
              </Accordion.Content>
            </Accordion.Message>
            <Accordion.Chevron />
          </Accordion.Trigger>
        </Accordion.Heading>
        <Accordion.Panel>
          <Accordion.Body>Handle lives on Accordion.Item.</Accordion.Body>
        </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}
