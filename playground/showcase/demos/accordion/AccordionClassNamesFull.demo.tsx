import { Accordion } from "@/components/composite/Accordion";

const items = [
  {
    title: "How to place an order?",
    content: "Delivery within Russia in 2–5 days. International shipping is calculated separately.",
  },
  {
    title: "Under what conditions can the product be returned?",
    content: "Returns are available within 14 days if the product is in resalable condition.",
  },
] as const;

export function AccordionClassNamesFullDemo() {
  return (
    <Accordion
      className="max-w-lg"
      defaultOpenIndex={0}
      classNames={{
        root: "gap-px",
        item: "border-primary/30",
        heading: "text-primary",
        trigger: "bg-primary/5",
        title: "text-primary font-semibold",
        chevron: "text-primary",
        panel: "bg-primary/5",
      }}
    >
      {items.map((item) => (
        <Accordion.Item key={item.title}>
          <Accordion.Heading>
            <Accordion.Trigger>
              <Accordion.Message>
                <Accordion.Content>
                  <Accordion.Title>{item.title}</Accordion.Title>
                </Accordion.Content>
                <Accordion.Chevron />
              </Accordion.Message>
            </Accordion.Trigger>
          </Accordion.Heading>
          <Accordion.Panel>
            <Accordion.Body>{item.content}</Accordion.Body>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
