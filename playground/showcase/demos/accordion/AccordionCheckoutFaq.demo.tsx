import { Accordion } from "@/components/composite/Accordion";

const FAQ = [
  {
    title: "How to place an order?",
    description: "Delivery and payment",
    body: "Delivery within the Russian Federation 2–5 days. Payment by card, SBP or upon receipt.",
  },
  {
    title: "Is it possible to return an item??",
    description: "Return Policy",
    body: "Return within 14 days if the original condition and packaging are preserved.",
  },
  {
    title: "How to care for the product?",
    description: "Care instructions",
    body: "Delicate wash 30°C. Do not use bleach.",
  },
] as const;

export function AccordionCheckoutFaqDemo() {
  return (
    <Accordion className="w-full max-w-lg" defaultOpenIndex={0}>
      {FAQ.map((item, index) => (
        <Accordion.Item key={item.title} value={String(index)}>
          <Accordion.Heading>
            <Accordion.Trigger>
              <Accordion.Message>
                <Accordion.Content>
                  <Accordion.Title>{item.title}</Accordion.Title>
                  <Accordion.Description>{item.description}</Accordion.Description>
                </Accordion.Content>
                <Accordion.Chevron />
              </Accordion.Message>
            </Accordion.Trigger>
          </Accordion.Heading>
          <Accordion.Panel>
            <Accordion.Body>{item.body}</Accordion.Body>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
