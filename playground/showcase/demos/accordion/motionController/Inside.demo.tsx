import { Accordion } from "@/components/composite/Accordion";
import { createMotionEvents, useMotionController } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "accordion:nudge": { x: 8, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

function TitlePulse() {
  const controller = useMotionController();
  return (
    <Accordion.Title onPointerEnter={() => controller.playSlot("title", "accordion:nudge")}>
      Hover title
    </Accordion.Title>
  );
}

export function AccordionMotionControllerInsideDemo() {
  return (
    <Accordion className="max-w-lg">
      <Accordion.Item value="a" motion={{ events }}>
        <Accordion.Heading>
          <Accordion.Trigger>
            <Accordion.Message>
              <Accordion.Content>
                <TitlePulse />
                <Accordion.Description>useMotionController() inside Item.</Accordion.Description>
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
  );
}
