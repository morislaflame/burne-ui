import { Accordion } from "@/components/composite/Accordion";

export function AccordionMotionBodyDemo() {
  return (
    <Accordion
      className="w-full max-w-lg"
      defaultOpenIndex={0}
      motion={{
        body: {
          enter: (ctx) =>
            ctx.fromTo({ y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.28 }),
          leave: { y: 6, autoAlpha: 0, duration: 0.16 },
        },
      }}
    >
      <Accordion.Item value="0">
        <Accordion.Heading>
          <Accordion.Trigger>
            <Accordion.Message>
              <Accordion.Content>
                <Accordion.Title>Shipping</Accordion.Title>
              </Accordion.Content>
              <Accordion.Chevron />
            </Accordion.Message>
          </Accordion.Trigger>
        </Accordion.Heading>
        <Accordion.Panel>
          <Accordion.Body>
            Accordion-only `motion.body` plays on open/close of the Expandable host.
          </Accordion.Body>
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="1">
        <Accordion.Heading>
          <Accordion.Trigger>
            <Accordion.Message>
              <Accordion.Content>
                <Accordion.Title>Returns</Accordion.Title>
              </Accordion.Content>
              <Accordion.Chevron />
            </Accordion.Message>
          </Accordion.Trigger>
        </Accordion.Heading>
        <Accordion.Panel>
          <Accordion.Body>Same body slot on every item.</Accordion.Body>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
