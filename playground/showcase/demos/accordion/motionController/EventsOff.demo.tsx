import { Button } from "@/components/core/Button";
import { Accordion } from "@/components/composite/Accordion";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const live = createMotionEvents({ "accordion:nudge": { x: 8, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" } });
const off = createMotionEvents({ "accordion:nudge": false });

function Item({
  value,
  title,
  controller,
  events,
}: {
  value: string;
  title: string;
  controller: ReturnType<typeof useMotionControllerHandle>;
  events: typeof live | typeof off;
}) {
  return (
    <Accordion.Item value={value} motionController={controller} motion={{ events }}>
      <Accordion.Heading>
        <Accordion.Trigger>
          <Accordion.Message>
            <Accordion.Content>
              <Accordion.Title>{title}</Accordion.Title>
            </Accordion.Content>
          </Accordion.Message>
          <Accordion.Chevron />
        </Accordion.Trigger>
      </Accordion.Heading>
      <Accordion.Panel>
        <Accordion.Body>One handle → one Item.</Accordion.Body>
      </Accordion.Panel>
    </Accordion.Item>
  );
}

export function AccordionMotionEventsOffDemo() {
  const liveController = useMotionControllerHandle();
  const offController = useMotionControllerHandle();
  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => liveController.playSlot("title", "accordion:nudge")}>Live</Button>
        <Button size="small" variant="ghost" onClick={() => offController.playSlot("title", "accordion:nudge")}>Off</Button>
      </div>
      <Accordion className="max-w-lg">
        <Item value="live" title="Live" controller={liveController} events={live} />
      </Accordion>
      <Accordion className="max-w-lg">
        <Item value="off" title="Off" controller={offController} events={off} />
      </Accordion>
    </div>
  );
}
