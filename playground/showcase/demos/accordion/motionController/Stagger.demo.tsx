import { Button } from "@/components/core/Button";
import { Accordion } from "@/components/composite/Accordion";
import { createMotionEvents, useMotionControllerHandle } from "@/components/core/utils/slotMotion";

const WAVE_EXCLUDE = ["panelShell", "triggerLift", "chevron", "panelInner", "body"] as const;
const events = createMotionEvents({
  "accordion:wave": { y: -6, duration: 0.22, replay: "rest", ease: "power2.out" },
  "accordion:rest": { y: 0, duration: 0.16, ease: "power2.out" },
});

export function AccordionMotionControllerStaggerDemo() {
  const controller = useMotionControllerHandle();
  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => void controller.playAll("accordion:wave", { stagger: 0.07, exclude: [...WAVE_EXCLUDE] })}>Stagger</Button>
        <Button size="small" variant="ghost" onClick={() => void controller.playAll("accordion:rest", { exclude: [...WAVE_EXCLUDE] })}>Reset</Button>
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
