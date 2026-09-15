import { Accordion } from "@/components/composite/Accordion";

export function AccordionMotionBodyDemo() {
  return (
    <Accordion
      className="w-full max-w-lg"
      motion={{
        body: {
          enter: (ctx) =>
            ctx.fromTo(
              { y: 8, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.28, delay: "expand" },
            ),
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
          `delay: "expand"` starts body after the panel height tween.
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
        <Accordion.Panel>Same delay token on every item.</Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
