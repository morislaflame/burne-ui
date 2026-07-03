import { Accordion } from "@/components/composite/Accordion";

import { EXPANDABLE_INFO_ICON } from "../../shared/constants";

const SIZES = ["small", "base", "mid", "large"] as const;

export function AccordionSizesDemo() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-mid">
      {SIZES.map((size) => (
        <Accordion key={size} size={size} defaultOpenIndex={0}>
          <Accordion.Item>
            <Accordion.Heading>
              <Accordion.Trigger>
                <Accordion.Message>
                  <Accordion.Icon>{EXPANDABLE_INFO_ICON}</Accordion.Icon>
                  <Accordion.Content>
                    <Accordion.Title>Size {size}</Accordion.Title>
                    <Accordion.Description>Accordion size={size}</Accordion.Description>
                  </Accordion.Content>
                </Accordion.Message>
                <Accordion.Indicator />
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body>Panel content for size {size}.</Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      ))}
    </div>
  );
}
