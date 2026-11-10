import { Button } from "@/components/core/Button";
import { Accordion } from "@/components/composite/Accordion";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "accordion:pulse": (ctx) => ctx.fromRest({ x: 6, duration: 0.35, yoyo: true, repeat: -1, ease: "sine.inOut" }),
});

export function AccordionMotionControllerCancelDemo() {
  const controller = useMotionControllerHandle();
  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.playSlot("title", "accordion:pulse")}>Loop</Button>
        <Button size="small" variant="ghost" onClick={() => { controller.cancel("title"); controller.set("title", { x: 0 }); }}>Cancel</Button>
      </div>
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
