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
                <Accordion.Title>Что такое Burne UI?</Accordion.Title>
                <Accordion.Description>Набор React-компонентов с compound API.</Accordion.Description>
              </Accordion.Content>
            </Accordion.Message>
            <Accordion.Indicator />
          </Accordion.Trigger>
        </Accordion.Heading>
        <Accordion.Panel>
          <Accordion.Body>Импортируйте из пакета или через alias в playground.</Accordion.Body>
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item>
        <Accordion.Heading>
          <Accordion.Trigger>
            <Accordion.Message>
              <Accordion.Content>
                <Accordion.Title>Как запустить Storybook?</Accordion.Title>
                <Accordion.Description>Локальная документация компонентов.</Accordion.Description>
              </Accordion.Content>
            </Accordion.Message>
            <Accordion.Indicator />
          </Accordion.Trigger>
        </Accordion.Heading>
        <Accordion.Panel>
          <Accordion.Body>
            <code className="text-primary">bun run storybook</code> — порт 6006.
          </Accordion.Body>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
