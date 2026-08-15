import { Accordion } from "@/components/composite/Accordion";

export function AccordionMotionInstantPanelDemo() {
  return (
    <Accordion className="w-full max-w-lg" defaultOpenIndex={0} motion={{ panelShell: { enter: false, leave: false } }}>
      <Accordion.Item value="0">
        <Accordion.Heading>
          <Accordion.Trigger>
            <Accordion.Message>
              <Accordion.Content>
                <Accordion.Title>Instant panel</Accordion.Title>
                <Accordion.Description>Height snaps. Chevron still rotates.</Accordion.Description>
              </Accordion.Content>
              <Accordion.Chevron />
            </Accordion.Message>
          </Accordion.Trigger>
        </Accordion.Heading>
        <Accordion.Panel>
          <Accordion.Body>`panelShell.enter/leave: false` on the Accordion root — every item inherits it.</Accordion.Body>
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="1">
        <Accordion.Heading>
          <Accordion.Trigger>
            <Accordion.Message>
              <Accordion.Content>
                <Accordion.Title>Same map</Accordion.Title>
                <Accordion.Description>Root motion applies to each Item.</Accordion.Description>
              </Accordion.Content>
              <Accordion.Chevron />
            </Accordion.Message>
          </Accordion.Trigger>
        </Accordion.Heading>
        <Accordion.Panel>
          <Accordion.Body>Open/close is instant; trigger squeeze still runs.</Accordion.Body>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
