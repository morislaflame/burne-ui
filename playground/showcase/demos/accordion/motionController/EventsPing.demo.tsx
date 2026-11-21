import { Button } from "@/components/core/Button";
import { Accordion } from "@/components/composite/Accordion";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "accordion:nudge": { x: 8, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

export function AccordionMotionEventsPingDemo() {
  const controller = useMotionControllerHandle();
  return (
    <div className="flex flex-col gap-2xlarge">
      <Button size="small" variant="outline" onClick={() => controller.playSlot("title", "accordion:nudge")}>Nudge</Button>
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
