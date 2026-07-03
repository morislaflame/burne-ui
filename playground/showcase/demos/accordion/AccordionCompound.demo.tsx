import { Accordion } from "@/components/composite/Accordion";

import { EXPANDABLE_INFO_ICON } from "../../shared/constants";

export function AccordionCompoundDemo() {
  return (
    <Accordion className="max-w-lg" defaultOpenIndex={0}>
      <Accordion.Item>
        <Accordion.Heading>
          <Accordion.Trigger>
            <Accordion.Message>
              <Accordion.Icon>{EXPANDABLE_INFO_ICON}</Accordion.Icon>
              <Accordion.Content>
                <Accordion.Title>What's happened Burne UI?</Accordion.Title>
                <Accordion.Description>Kit React-components with compound API.</Accordion.Description>
              </Accordion.Content>
            </Accordion.Message>
            <Accordion.Indicator />
          </Accordion.Trigger>
        </Accordion.Heading>
        <Accordion.Panel>
          <Accordion.Body>Import from a package or via alias in playground.</Accordion.Body>
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item>
        <Accordion.Heading>
          <Accordion.Trigger>
            <Accordion.Message>
              <Accordion.Content>
                <Accordion.Title>How to launch Storybook?</Accordion.Title>
                <Accordion.Description>Local component documentation.</Accordion.Description>
              </Accordion.Content>
            </Accordion.Message>
            <Accordion.Indicator />
          </Accordion.Trigger>
        </Accordion.Heading>
        <Accordion.Panel>
          <Accordion.Body>
            <code className="text-primary">bun run storybook</code> — port 6006.
          </Accordion.Body>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
