import { Button } from "@/components/core/Button";
import { Accordion } from "@/components/composite/Accordion";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function AccordionMotionControllerDemo() {
  const controller = useMotionControllerHandle();
  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("title", "enter")}>Pulse title</Button>
        <Button size="small" variant="outline" onClick={() => controller.playSlot("title", "leave")}>Reset</Button>
        <Button size="small" variant="ghost" onClick={() => controller.set("title", { x: 0 })}>Snap</Button>
      </div>
      <Accordion className="max-w-lg">
        <Accordion.Item value="a" motionController={controller} motion={{
          title: { enter: { x: 8, duration: 0.28, replay: "rest" }, leave: { x: 0, duration: 0.2 } },
        }}>
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
