import { Button } from "@/components/core/Button";
import { Accordion } from "@/components/composite/Accordion";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "accordion:nudge": { x: 8, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

function FaqItem({
  value,
  title,
  controller,
}: {
  value: string;
  title: string;
  controller: ReturnType<typeof useMotionControllerHandle>;
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
        <Accordion.Body>One handle does not drive sibling Items.</Accordion.Body>
      </Accordion.Panel>
    </Accordion.Item>
  );
}

export function AccordionMotionControllerRepeatedDemo() {
  const first = useMotionControllerHandle();
  const second = useMotionControllerHandle();
  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => first.playSlot("title", "accordion:nudge")}>Pulse A</Button>
        <Button size="small" variant="outline" onClick={() => second.playSlot("title", "accordion:nudge")}>Pulse B</Button>
      </div>
      <Accordion className="max-w-lg">
        <FaqItem value="a" title="Item A" controller={first} />
        <FaqItem value="b" title="Item B" controller={second} />
      </Accordion>
    </div>
  );
}
